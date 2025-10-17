import { useEffect, useState } from "react";
import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  useCategoriasStore,
  Icono,
  ConvertirCapitalize,
} from "../../../index";
import { useForm } from "react-hook-form";
import { CirclePicker } from "react-color";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function RegistrarCategorias({
  onClose,
  dataSelect,
  accion,
  setIsExploding,
}) {
  const { insertarCategorias, editarCategoria } = useCategoriasStore();
  const { dataempresa } = useEmpresaStore();
  const [currentColor, setColor] = useState("#F44336");
  const [iconoUrl, setIconoUrl] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // ✅ useMutation seguro con control de doble clic
  const { mutateAsync, isPending } = useMutation({
    mutationFn: insertar,
    mutationKey: ["insertar categorias"],
    onSuccess: () => {
      toast.success("Categoría guardada correctamente");
      cerrarFormulario();
    },
    onError: (err) => {
      console.error("Error:", err.message);
      toast.error("Oops... " + (err.message || "Error al guardar categoría"));
    },
  });

  const cerrarFormulario = () => {
    reset();
    onClose();
    setIsExploding(true);
  };

  // --- Inserción o Edición ---
  async function insertar(data) {
    const nombre = ConvertirCapitalize(data.descripcion.trim());

    const payload = {
      _nombre: nombre,
      _color: currentColor,
      _icono: iconoUrl || "-",
      _id_empresa: dataempresa.id,
    };

    if (accion === "Editar") {
      payload._id = dataSelect.id;
      await editarCategoria(payload);
    } else {
      // ⚡ Evita duplicados consultando antes
      const existe = await insertarCategorias(payload, true);
      if (existe === "DUPLICADO") {
        throw new Error("Ya existe una categoría con ese nombre");
      }
    }
  }

  // ✅ Manejador de envío
  const handlesub = async (data) => {
    if (isPending) return; // evita doble envío
    await mutateAsync(data);
  };

  useEffect(() => {
    if (accion === "Editar") {
      setColor(dataSelect.color);
      setIconoUrl(dataSelect.icono);
    }
  }, []);

  return (
    <Container>
      <div className="sub-contenedor">
        {/* --- CABECERA --- */}
        <div className="headers">
          <section>
            <h1>
              {accion === "Editar"
                ? "Editar categoría"
                : "Registrar nueva categoría"}
            </h1>
          </section>
          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>

        {/* --- VISTA PREVIA --- */}
        <PictureContainer>
          {iconoUrl && iconoUrl !== "-" ? (
            <div className="ContentImage">
              <img src={iconoUrl} alt="icono categoría" />
            </div>
          ) : (
            <Icono>{<v.iconoimagenvacia />}</Icono>
          )}
        </PictureContainer>

        {/* --- FORMULARIO --- */}
        <form className="formulario" onSubmit={handleSubmit(handlesub)}>
          <section className="form-subcontainer">
            {/* Nombre */}
            <article>
              <InputText icono={<v.iconoflechaderecha />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect?.nombre}
                  type="text"
                  placeholder="Categoría"
                  {...register("descripcion", { required: true })}
                />
                <label className="form__label">Categoría</label>
                {errors.descripcion?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>

            {/* Campo de URL */}
            <article>
              <InputText icono={<v.iconosupabase />}>
                <input
                  className="form__field"
                  value={iconoUrl}
                  onChange={(e) => setIconoUrl(e.target.value)}
                  type="text"
                  placeholder="Pega aquí la URL pública de la imagen"
                />
                <label className="form__label">URL de imagen</label>
              </InputText>
            </article>

            {/* Selector de color */}
            <article className="colorContainer">
              <ContentTitle>
                {<v.paletacolores />}
                <span>Color</span>
              </ContentTitle>
              <div className="colorPickerContent">
                <CirclePicker
                  onChange={(color) => setColor(color.hex)}
                  color={currentColor}
                />
              </div>
            </article>

            {/* Botón guardar */}
            <Btn1
              icono={<v.iconoguardar />}
              titulo={isPending ? "Guardando..." : "Guardar"}
              bgcolor="#F9D70B"
              disabled={isPending} // ✅ evita clics múltiples
            />
          </section>
        </form>
      </div>
    </Container>
  );
}

const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px 0;

  .sub-contenedor {
    position: relative;
    width: 500px;
    max-width: 90%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 20px 36px 30px 36px;
    z-index: 100;
    max-height: 95vh;
    overflow-y: auto;
  }

  .headers {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      font-size: 20px;
      font-weight: 500;
    }
    span {
      font-size: 20px;
      cursor: pointer;
    }
  }

  .formulario {
    .form-subcontainer {
      gap: 20px;
      display: flex;
      flex-direction: column;

      .colorContainer {
        .colorPickerContent {
          padding-top: 15px;
          min-height: 50px;
        }
      }
    }
  }
`;

const ContentTitle = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 20px;
  svg {
    font-size: 25px;
  }
`;

const PictureContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #f9d70b;
  border-radius: 10px;
  background-color: rgba(249, 215, 11, 0.1);
  padding: 10px;
  position: relative;
  gap: 5px;
  margin-bottom: 15px;
  max-height: 250px;

  .ContentImage {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 100%;
    height: 100%;
    img {
      max-width: 100%;
      max-height: 230px;
      object-fit: contain;
      border-radius: 8px;
    }
  }
`;
