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

// Import del utilitario para enviar correo
import { sendUserEmail } from "../../../api/send-email";

export function RegistrarUsuarios({ accion, dataSelect, onClose }) {
  const queryClient = useQueryClient();
  const {
    cajaSelectItem,
    mostrarCajaXSucursal,
  } = useCajasStore();
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
  const { data: dataCaja, isLoading: isloadingCajas } = useQuery({
    queryKey: [
      "mostrar caja por sucursal",
      { id_sucursal: sucursalesItemSelect?.id },
    ],
    queryFn: () =>
      mostrarCajaXSucursal({ id_sucursal: sucursalesItemSelect?.id }),
    enabled: !!sucursalesItemSelect,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      nombres: itemSelect?.usuario,
      email: itemSelect?.email,
      nro_doc: itemSelect?.nro_doc,
      telefono: itemSelect?.telefono,
      pass: 123456,
    },
  });

  const insertar = async (data) => {
    if (accion === "Editar") {
      const p = {
        id: itemSelect?.id_usuario,
        nombres: data.nombres,
        nro_doc: data.nro_doc,
        telefono: data.telefono,
        id_rol: rolesItemSelect?.id,
        // datos asignación caja y sucursal si aplica…
      };
      console.log("pEditar", p);
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
        pass: data.pass,
      };

      // 1. Crear el usuario en Auth + tu tabla
      await insertarUsuario(p);

      // 2. Enviar correo al usuario:
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
        <span>guardando...🔼</span>
      ) : (
        <Form onSubmit={handleSubmit(manejadorInsertar)}>
          <Header>
            <Title>{accion === "Editar" ? "Editar usuario" : "Registrar usuario"}</Title>
            <BtnClose funcion={onClose} />
          </Header>
          <section className="main">
            <section className="area1">
              
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

              {/* CONTRASEÑA */}
              <article>
                <InputText
                  icono={
                    <Icon
                      icon="material-symbols-light:lock-outline"
                      width="24"
                      height="24"
                    />
                  }
                >
                  <input
                    disabled={accion === "Editar" ? true : false}
                    className="form__field"
                    type="password"
                    {...register("pass", {
                      required: "Campo requerido",
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/,
                        message: "Debe tener 8+ caracteres, número y símbolo",
                      },
                    })}
                  />
                  <label className="form__label">Contraseña</label>
                  {errors.pass && <p>{errors.pass.message}</p>}
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
                        message: "Debe tener 13 dígitos",
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
                  icono={<Icon icon="solar:document-outline" width="24" height="24" />}
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
