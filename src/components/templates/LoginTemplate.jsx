import styled from "styled-components";
import {
  useAuthStore,
} from "../../index";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { useState } from "react";
import loginImage from "../../assets/CVLOGO1.jpg";

export function LoginTemplate() {
  const [rol] = useState("cajero");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const { loginEmail } = useAuthStore();
  const { register, handleSubmit } = useForm();

  const { mutate } = useMutation({
    mutationKey: ["iniciar con email"],
    mutationFn: loginEmail,
    onSuccess: async (data) => {
      const response = await fetch(
        `https://csjldpyuyxlxxkogfalj.supabase.co/rest/v1/usuarios?correo=eq.${data.email}`,
        {
          headers: {
            apikey: import.meta.env.VITE_APP_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_APP_SUPABASE_ANON_KEY}`,
          },
        }
      );
      const usuario = await response.json();

      if (usuario.length > 0 && usuario[0].must_change_password) {
        window.location.href = "/primer-acceso";
        return;
      }

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
      <Toaster position="top-center" richColors />
      
      <ContentWrapper>
        {/* Imagen a la izquierda - OCUPA TODO */}
        <ImageWrapper>
          <FullImage src={loginImage} alt="Cosecha Verde" />
        </ImageWrapper>

        {/* Formulario a la derecha */}
        <FormWrapper>
          <FormCard>
            {/* Logo pequeño arriba del formulario */}
            <LogoCircle>
              <SmallLogo src={loginImage} alt="Logo" />
            </LogoCircle>

            {/* Título */}
            <TitleSection>
              <MainTitle>Bienvenido</MainTitle>
              <SubTitle>Ingrese sus credenciales</SubTitle>
            </TitleSection>

            {/* Formulario */}
            <StyledForm onSubmit={handleSubmit(manejadorEmailSesion)}>
              <InputGroup>
                <InputLabel>Correo Electrónico</InputLabel>
                <InputContainer>
                  <IconSpan>📧</IconSpan>
                  <ModernInput
                    placeholder="admin@agropos.com"
                    type="email"
                    {...register("email", { required: true })}
                  />
                </InputContainer>
              </InputGroup>

              <InputGroup>
                <InputLabel>Contraseña</InputLabel>
                <InputContainer>
                  <IconSpan>🔒</IconSpan>
                  <ModernInput
                    placeholder="••••••••"
                    type={mostrarPassword ? "text" : "password"}
                    {...register("password", { required: true })}
                  />
                  <EyeButton 
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                  >
                    {mostrarPassword ? "👁️" : "👁️‍🗨️"}
                  </EyeButton>
                </InputContainer>
              </InputGroup>

              <SubmitButton type="submit">
                <span>Iniciar Sesión</span>
                <Arrow>→</Arrow>
              </SubmitButton>
            </StyledForm>

            {/* Footer */}
            <FooterLinks>
              <FooterText>¿Olvidaste tu contraseña?</FooterText>
              <RecoveryLink href="/recuperar-acceso">Recuperar acceso</RecoveryLink>
            </FooterLinks>
          </FormCard>
        </FormWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
}

// Styled Components
const PageWrapper = styled.div`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  background: #1a1a1a;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const ImageWrapper = styled.div`
  flex: 1;
  background-color: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  @media (max-width: 968px) {
    height: 40vh;
  }
`;

const FullImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;

  @media (max-width: 968px) {
    object-fit: contain;
  }
`;

const FormWrapper = styled.div`
  flex: 0 0 500px;
  background: #0000009b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  @media (max-width: 968px) {
    flex: 1;
    width: 100%;
    padding: 30px 20px;
  }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: rgba(42, 42, 42, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px 35px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const LogoCircle = styled.div`
  width: 100px;
  height: 100px;
  background: #000000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;

const SmallLogo = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 50%;
`;

const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 35px;
`;

const MainTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
  font-weight: 500;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #d0d0d0;
  letter-spacing: 0.3px;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconSpan = styled.span`
  position: absolute;
  left: 14px;
  font-size: 18px;
  z-index: 1;
  pointer-events: none;
`;

const ModernInput = styled.input`
  width: 100%;
  padding: 14px 14px 14px 45px;
  border: 2px solid #3a3a3a;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: #1f1f1f;
  color: #ffffff;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #6366f1;
    background: #252525;
    box-shadow: 0 0 0 3px rgba(0, 4, 255, 0.1);
  }

  &::placeholder {
    color: #666666;
    font-weight: 400;
  }

  &:hover {
    border-color: #ff0000;
  }
`;

const EyeButton = styled.button`
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
  transition: transform 0.2s ease;
  z-index: 1;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(99, 102, 241, 0.4);
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Arrow = styled.span`
  transition: transform 0.3s ease;
  font-size: 20px;

  ${SubmitButton}:hover & {
    transform: translateX(4px);
  }
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #3a3a3a;
`;

const FooterText = styled.span`
  font-size: 13px;
  color: #909090;
`;

const RecoveryLink = styled.a`
  font-size: 13px;
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;

  &:hover {
    color: #8b5cf6;
    text-decoration: underline;
  }
`;