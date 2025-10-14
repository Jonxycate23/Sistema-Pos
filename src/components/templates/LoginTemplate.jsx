import styled from "styled-components";
import {
  Btn1,
  Footer,
  Generarcodigo,
  InputText2,
  Title,
  useAuthStore,
} from "../../index";
import { v } from "../../styles/variables";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { useState } from "react";

// ⚠️ Asegúrate de que esta imagen existe
import loginImage from "../../assets/CVLOGO.jpg";

export function LoginTemplate() {
  const [rol] = useState("cajero");
  const [mostrarPassword, setMostrarPassword] = useState(false); // 👈 Para mostrar/ocultar contraseña

  const { loginEmail } = useAuthStore();
  const { register, handleSubmit } = useForm();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["iniciar con email"],
    mutationFn: loginEmail,
    onSuccess: (data) => {
      if (rol === "dueno" && data.rol !== "superadmin") {
        toast.error("Este usuario no tiene rol de Dueño.");
        return;
      }
      if (rol === "cajero" && data.rol !== "empleado") {
        toast.error("Este usuario no tiene rol de Cajero.");
        return;
      }

      if (data.rol === "superadmin") {
        window.location.href = "/panel-admin";
      } else if (data.rol === "empleado") {
        window.location.href = "/panel-cajero";
      } else {
        toast.error("Rol no reconocido.");
      }
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const manejadorEmailSesion = (data) => {
    mutate({ email: data.email, password: data.password });
  };

  return (
    <PageWrapper>
      <Toaster />
      <ContentWrapper>
        {/* Imagen a la izquierda */}
        <ImageWrapper>
          <img src={loginImage} alt="Imagen de inicio" />
        </ImageWrapper>

        {/* Login a la derecha */}
        <LoginWrapper>
          <TitleContainer>
            <Title $paddingbottom="10px" style={{ textAlign: "center" }}>
              BIENVENIDO
            </Title>
            <p style={{ textAlign: "center", marginBottom: "30px", color: "#888" }}>
              Ingresa tus credenciales para poder acceder
            </p>
          </TitleContainer>

          <form onSubmit={handleSubmit(manejadorEmailSesion)}>
            <InputText2>
              <input
                className="form__field"
                placeholder="email"
                type="text"
                {...register("email", { required: true })}
              />
            </InputText2>

            <InputText2 style={{ position: "relative" }}>
              <input
                className="form__field"
                placeholder="contraseña"
                type={mostrarPassword ? "text" : "password"}
                {...register("password", { required: true })}
              />
              <MostrarPassword onClick={() => setMostrarPassword(!mostrarPassword)}>
                {mostrarPassword ? "Ocultar" : "Ver"}
              </MostrarPassword>
            </InputText2>

            <Btn1
              border="2px"
              titulo="INGRESAR"
              bgcolor="#1CB0F6"
              color="255,255,255"
              width="100%"
            />
          </form>
        </LoginWrapper>
      </ContentWrapper>
      <Footer />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageWrapper = styled.div`
  flex: 1;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const LoginWrapper = styled.div`
  flex: 0 0 33%; // 👈 más angosto
  background-color: ${({ theme }) => theme.bgAlt || "#000000"}; // 👈 más oscuro
  color: ${({ theme }) => theme.text};
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  @media (max-width: 768px) {
    flex: none;
    width: 100%;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MostrarPassword = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: #1cb0f6;
  cursor: pointer;
  user-select: none;
`;
