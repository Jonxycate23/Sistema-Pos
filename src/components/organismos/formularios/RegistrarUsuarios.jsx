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
  const generarPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";
    return Array.from({ length: 10 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  // Mostrar/ocultar contraseña (para crear) y nueva contraseña (para editar)
  const [showPassCrear, setShowPassCrear] = useState(false);
  const [showPassEditar, setShowPassEditar] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      nombres: itemSelect?.usuario || "",
      email: itemSelect?.email || "",
      nro_doc: itemSelect?.nro_doc || "",
      telefono: itemSelect?.telefono || "",
      pass: "", // contraseña inicial (crear)
      newPassword: "", // nueva contraseña (editar)
    },
    mode: "onBlur",
  });

  // Generar contraseña al crear nuevo usuario y setear en el form
  useEffect(() => {
    if (accion !== "Editar") {
      const pass = generarPassword();
      setValue("pass", pass);
    } else {
      // al editar, aseguramos newPassword vacío por defecto
      setValue("newPassword", "");
    }
  }, [accion, setValue]);

  // opcional: ver valor actual (útil para debug)
  const passCrearValue = watch("pass");
  const passEditarValue = watch("newPassword");

  const insertar = async (data) => {
    if (accion === "Editar") {
      const p = {
        id: itemSelect?.id_usuario,
        nombres: data.nombres,
        nro_doc: data.nro_doc,
        telefono: data.telefono,
        id_rol: rolesItemSelect?.id,
      };

      // si el admin escribió una nueva contraseña, se envía
      if (data.newPassword && data.newPassword.trim() !== "") {
        p.pass = data.newPassword;
      }

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
        pass: data.pass, // puede ser la autogenerada o la que el admin editó
      };

      await insertarUsuario(p);

      const result = await sendUserEmail({
        email: data.email,
        nombre: data.nombres,
        password: data.pass,
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

  return (
    <Container>
      {isPending ? (
        <span>Guardando... 🔼</span>
      ) : (
        <Form onSubmit={handleSubmit(manejadorInsertar)}>
          <Header>
            <Title>
              {accion === "Editar" ? "Editar usuario" : "Registrar usuario"}
            </Title>
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

              {/* ========== CONTRASEÑA AL CREAR (AUTOGENERADA pero oculta y editable) ========== */}
              {accion !== "Editar" && (
                <article>
                  <InputText
                    icono={
                      <Icon
                        icon="material-symbols:lock-outline"
                        width="24"
                        height="24"
                      />
                    }
                  >
                    <div style={{ position: "relative", width: "100%" }}>
                      <input
                        className="form__field"
                        type={showPassCrear ? "text" : "password"}
                        {...register("pass", {
                          required: "La contraseña es requerida",
                          minLength: {
                            value: 6,
                            message: "Mínimo 6 caracteres",
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassCrear(!showPassCrear)}
                        aria-label={showPassCrear ? "Ocultar contraseña" : "Mostrar contraseña"}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        <Icon
                          icon={showPassCrear ? "mdi:eye-off" : "mdi:eye"}
                          width="20"
                          height="20"
                        />
                      </button>
                    </div>
                    <label className="form__label">Contraseña (editable)</label>
                    {errors.pass && <p>{errors.pass.message}</p>}
                  </InputText>
                </article>
              )}

              {/* ========== NUEVA CONTRASEÑA AL EDITAR (opcional, oculta y editable) ========== */}
              {accion === "Editar" && (
                <article>
                  <InputText
                    icono={
                      <Icon
                        icon="material-symbols:lock-outline"
                        width="24"
                        height="24"
                      />
                    }
                  >
                    <div style={{ position: "relative", width: "100%" }}>
                      <input
                        className="form__field"
                        type={showPassEditar ? "text" : "password"}
                        {...register("newPassword", {
                          // opcional: si quieres, puedes validar longitud mínima
                          minLength: {
                            value: 6,
                            message: "Mínimo 6 caracteres",
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassEditar(!showPassEditar)}
                        aria-label={showPassEditar ? "Ocultar contraseña" : "Mostrar contraseña"}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        <Icon
                          icon={showPassEditar ? "mdi:eye-off" : "mdi:eye"}
                          width="20"
                          height="20"
                        />
                      </button>
                    </div>
                    <label className="form__label">Nueva contraseña (opcional)</label>
                    {errors.newPassword && <p>{errors.newPassword.message}</p>}
                  </InputText>
                </article>
              )}

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
