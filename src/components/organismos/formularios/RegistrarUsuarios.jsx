import styled from "styled-components";
import {
  InputText,
  Btn1,
  useSucursalesStore,
  useEmpresaStore,
  useUsuariosStore,
  Device,
} from "../../../index";
import { useForm } from "react-hook-form";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCajasStore } from "../../../store/CajasStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SelectList } from "../../ui/lists/SelectList";
import { BarLoader } from "react-spinners";
import { PermisosUser } from "../UsuariosDesign/PermisosUser";
import { useRolesStore } from "../../../store/RolesStore";
import { useEffect, useState } from "react";

// Import del utilitario para enviar correo
import { sendUserEmail } from "../../../api/send-email";

export function RegistrarUsuarios({ accion, dataSelect, onClose }) {
  const queryClient = useQueryClient();
  const { cajaSelectItem, mostrarCajaXSucursal } = useCajasStore();
  const { insertarUsuario, itemSelect, editarUsuarios } = useUsuariosStore();
  const { dataempresa } = useEmpresaStore();
  const { mostrarSucursales, sucursalesItemSelect, selectSucursal } =
    useSucursalesStore();
  const { rolesItemSelect } = useRolesStore();

  const { data: dataSucursales, isLoading: isloadingSucursales } = useQuery({
    queryKey: ["mostrar sucursales", { id_empresa: dataempresa?.id }],
    queryFn: () => mostrarSucursales({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });

  const { isLoading: isloadingCajas } = useQuery({
    queryKey: [
      "mostrar caja por sucursal",
      { id_sucursal: sucursalesItemSelect?.id },
    ],
    queryFn: () =>
      mostrarCajaXSucursal({ id_sucursal: sucursalesItemSelect?.id }),
    enabled: !!sucursalesItemSelect,
  });

  // --- Generar contraseña automática ---
  const [generatedPassword, setGeneratedPassword] = useState("");
  const generarPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  useEffect(() => {
    if (accion !== "Editar") {
      setGeneratedPassword(generarPassword());
    }
  }, [accion]);

  // --- Configuración del formulario ---
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      nombres: itemSelect?.usuario || "",
      email: itemSelect?.email || "",
      nro_doc: itemSelect?.nro_doc || "",
      telefono: itemSelect?.telefono || "",
    },
    mode: "onBlur", // 🔥 Muestra error cuando el usuario sale del campo
  });


  // --- Insertar o editar ---
  const insertar = async (data) => {
    if (accion === "Editar") {
      const p = {
        id: itemSelect?.id_usuario,
        nombres: data.nombres,
        nro_doc: data.nro_doc,
        telefono: data.telefono,
        id_rol: rolesItemSelect?.id,
      };
      await editarUsuarios(p);
    } else {
      const p = {
        nombres: data.nombres,
        nro_doc: data.nro_doc,
        telefono: data.telefono,
        id_rol: rolesItemSelect?.id,
        correo: data.email,
        id_sucursal: sucursalesItemSelect?.id,
        id_caja: cajaSelectItem?.id,
        email: data.email,
        pass: generatedPassword,
      };

      // 1. Crear usuario en auth + tabla usuarios
      await insertarUsuario(p);

      // 2. Enviar correo con la contraseña generada
      const result = await sendUserEmail({
        email: data.email,
        nombre: data.nombres,
        password: generatedPassword,
      });

      if (!result.success) {
        toast.warning("Usuario creado pero el correo no se envió 🚨");
      } else {
        toast.success("Correo enviado exitosamente 📩");
      }
    }
  };

  const { isPending, mutate: doInsertar } = useMutation({
    mutationKey: ["insertar usuarios"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Usuario registrado correctamente");
      queryClient.invalidateQueries(["mostrar usuarios asignados"]);
      onClose();
    },
  });

  const manejadorInsertar = (data) => {
    doInsertar(data);
  };

  const isLoading = isloadingSucursales || isloadingCajas;
  if (isLoading) return <BarLoader color="#6d6d6d" />;

  // --- Render ---
  return (
    <Container>
      {isPending ? (
        <span>Guardando... 🔼</span>
      ) : (
        <Form onSubmit={handleSubmit(manejadorInsertar)}>
          <Header>
            <Title>{accion === "Editar" ? "Editar usuario" : "Registrar usuario"}</Title>
            <BtnClose funcion={onClose} />
          </Header>

          <section className="main">
            <section className="area1">

          {/* NOMBRE */}
          <article>
            <InputText
              icono={<Icon icon="icon-park-solid:edit-name" width="24" height="24" />}
            >
              <input
                className="form__field"
                type="text"
                {...register("nombres", {
                  required: "Campo requerido",
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                    message: "Solo letras y espacios permitidos",
                  },
                })}
              />
              <label className="form__label">Nombre Completo</label>
              {errors.nombres && <p>{errors.nombres.message}</p>}
            </InputText>
          </article>

          {/* DPI */}
          <article>
            <InputText
              icono={<Icon icon="solar:document-outline" width="24" height="24" />}
            >
              <input
                className="form__field"
                type="text"
                {...register("nro_doc", {
                  required: "Campo requerido",
                  pattern: {
                    value: /^\d{13}$/,
                    message: "Debe tener exactamente 13 dígitos",
                  },
                })}
              />
              <label className="form__label">No. DPI</label>
              {errors.nro_doc && <p>{errors.nro_doc.message}</p>}
            </InputText>
          </article>

          {/* TELÉFONO */}
          <article>
            <InputText
              icono={<Icon icon="material-symbols:call-outline" width="24" height="24" />}
            >
              <input
                className="form__field"
                type="text"
                {...register("telefono", {
                  required: "Campo requerido",
                  pattern: {
                    value: /^\d{8}$/,
                    message: "Debe tener 8 dígitos",
                  },
                })}
              />
              <label className="form__label">Teléfono</label>
              {errors.telefono && <p>{errors.telefono.message}</p>}
            </InputText>
          </article>

          {/* EMAIL */}
          <article>
            <InputText
              icono={
                <Icon
                  icon="material-symbols-light:stacked-email-outline-rounded"
                  width="24"
                  height="24"
                />
              }
            >
              <input
                disabled={accion === "Editar" ? true : false}
                className="form__field"
                type="text"
                {...register("email", {
                  required: "Campo requerido",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Correo no válido",
                  },
                })}
              />
              <label className="form__label">Email</label>
              {errors.email && <p>{errors.email.message}</p>}
            </InputText>
          </article>

          {/* CONTRASEÑA AUTOGENERADA */}
          <article>
            <InputText
              icono={<Icon icon="material-symbols:lock-outline" width="24" height="24" />}
            >
              <input
                disabled
                className="form__field"
                type="password"
                value={generatedPassword}
              />
              <label className="form__label">Contraseña generada</label>
            </InputText>
          </article>


              <span>Asignación de sucursal</span>
              <article className="contentasignacion">
                <span>Sucursal:</span>
                <SelectList
                  onSelect={selectSucursal}
                  itemSelect={sucursalesItemSelect}
                  displayField="nombre"
                  data={dataSucursales}
                />
              </article>

              <Btn1 titulo={"Guardar"} bgcolor={"#2c2ca8"} color={"#fff"} />
            </section>

            <section className="area2">
              <PermisosUser />
            </section>
          </section>
        </Form>
      )}
    </Container>
  );
}

// --- Estilos ---
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
  backdrop-filter: blur(5px);
  padding: 1rem;
`;

const Form = styled.form`
  width: 100%;
  max-width: 900px;
  background-color: ${({ theme }) => theme.body};
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .main {
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: auto;
    justify-content: center;

    @media ${Device.laptop} {
      flex-direction: row;
    }

    .area1 {
      display: flex;
      flex-direction: column;
      height: 100%;
      align-items: center;
    }

    .area2 {
      display: flex;
      flex-direction: column;
      height: 100%;
      align-items: center;
    }
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: center;
`;

const Title = styled.span`
  font-size: 30px;
  font-weight: bold;
`;
