import React, { useEffect } from "react";
import styled from "styled-components";
import { CardFuncion } from "./CardFuncion";
import { Device } from "../../../styles/breakpoints";
import ScrollReveal from "scrollreveal";
import { BtnLink } from "../../moleculas/BtnLink";
import { useUsuariosStore } from "../../../store/UsuariosStore";

export const LandingPagesWelcome = () => {
  const { datausuarios } = useUsuariosStore();

  useEffect(() => {
    ScrollReveal().reveal(".left-section", {
      origin: "left",
      distance: "100px",
      duration: 1000,
      easing: "ease-in-out",
    });

    ScrollReveal().reveal(".right-section", {
      origin: "right",
      distance: "100px",
      duration: 1000,
      easing: "ease-in-out",
    });

    ScrollReveal().reveal(".footer-section", {
      origin: "bottom",
      distance: "100px",
      duration: 1000,
      easing: "ease-in-out",
      delay: 200,
    });
  }, []);

  return (
    <Container>
      <ContentSection>
        <SubContentSection>
          <LeftSection className="left-section">
            <h1>SISTEMA POS COSECHA VERDE</h1>

            <Step>
              <IconPlaceholder>
                <img src="https://cdn-icons-png.flaticon.com/512/1670/1670024.png" alt="fertilizante" />
              </IconPlaceholder>
              <Text>
                <Title>Controla tus productos agrícolas</Title>
                <Description>
                  Lleva un registro claro de abonos, fertilizantes, insecticidas y más.
                </Description>
              </Text>
            </Step>

            <Step>
              <IconPlaceholder>
                <img src="https://images.icon-icons.com/1846/PNG/512/cashier2_116164.png" alt="caja" />
              </IconPlaceholder>
              <Text>
                <Title>Ventas rápidas y precisas</Title>
                <Description>
                  Facturación instantánea, gestión de efectivo y control de caja.
                </Description>
              </Text>
            </Step>

            <Step>
              <IconPlaceholder>
                <img src="https://cdn-icons-png.flaticon.com/512/172/172099.png" alt="almacen" />
              </IconPlaceholder>
              <Text>
                <Title>Gestiona tu almacén</Title>
                <Description>
                  Controla stock por categorías: semillas, productos veterinarios, etc.
                </Description>
              </Text>
            </Step>

            <Step>
              <IconPlaceholder>
                <img src="https://cdn-icons-png.flaticon.com/512/7542/7542547.png" alt="clientes" />
              </IconPlaceholder>
              <Text>
                <Title>Clientes frecuentes</Title>
                <Description>
                  Fideliza clientes agrícolas y ofrece descuentos por volumen.
                </Description>
              </Text>
            </Step>

          </LeftSection>

          <RightSection className="right-section">
            <MockupImage>
              <CardFuncion
                top="10px"
                bgcontentimagen={"#fccdb8"}
                left={"-50px"}
                title={"Control de Inventario"}
                imagen={"https://cdn-icons-png.freepik.com/256/12201/12201513.png?semt=ais_white_label"}
              />
              <CardFuncion
                top="110px"
                bgcontentimagen={"#e3d4cc"}
                left={"-20px"}
                title={"Gestión de Ventas"}
                imagen={"https://cdn-icons-png.freepik.com/512/432/432796.png"}
              />
              <CardFuncion
                top="210px"
                bgcontentimagen={"#aee0fd"}
                left={"-50px"}
                title={"Clientes y Créditos"}
                imagen={"https://cdn-icons-png.flaticon.com/512/3153/3153341.png"}
              />
              <CardFuncion
                top="310px"
                bgcontentimagen={"#fdc2b7"}
                left={"-20px"}
                title={"Módulo de Compras"}
                imagen={"https://cdn-icons-png.flaticon.com/512/3153/3153341.png"}
              />
              <CardFuncion
                top="410px"
                bgcontentimagen={"#52e0f9"}
                left={"-50px"}
                title={"Reportes PDF / Excel"}
                imagen={"https://qkzybkelsdmoezaaypou.supabase.co/storage/v1/object/public/imagenes/modulos/impresora.png"}
              />
            </MockupImage>
          </RightSection>
        </SubContentSection>
      </ContentSection>

      <Footer className="footer-section">
        <FooterTitle>Contactanos</FooterTitle>
        <FooterContent>
          <FooterItem>
            <FooterIcon>
              <img src="https://images.icon-icons.com/3658/PNG/512/direction_pin_navigation_location_map_icon_228425.png" />
            </FooterIcon>
            <FooterText>
              <FooterTextTitle>Dirección</FooterTextTitle>
              <FooterDescription>
                San Juan Comalapa, Chimaltenango
              </FooterDescription>
            </FooterText>
          </FooterItem>
          <FooterItem>
            <FooterIcon>
              <img src="https://images.vexels.com/media/users/3/135236/isolated/preview/66a57f55c58bf9cea98239ca1f5be162-senal-de-telefono-con-fondo-redondo.png" />
            </FooterIcon>
            <FooterText>
              <FooterTextTitle>Contacto</FooterTextTitle>
              <FooterDescription>
                Tel: +502 4143 6701 <br />
                WhatsApp: +502 4143 6701 <br />
                Email: contacto@gmail.com
              </FooterDescription>
            </FooterText>
          </FooterItem>
        </FooterContent>
      </Footer>
    </Container>
  );
};

// El resto de tus styled-components va aquí sin cambios

const Container = styled.div`
  height: 100vh; /* ← Pantalla completa */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* ← Acomoda bien arriba, centro y abajo */
  overflow: hidden; /* ← Elimina scroll */
  padding: 20px;
`;


const SubContentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  @media ${Device.desktop} {
    flex-direction: row;
    justify-content: space-between;
    width: 60%;
  }
`;

const ContentSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  h1 {
    text-align: center;
    font-size:35px;
  }
  @media ${Device.desktop} {
    align-items: flex-start;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  @media ${Device.desktop} {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
  }
`;

const IconPlaceholder = styled.div`
  width: 40px;
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 4px solid #f0f0f0;
  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
  @media ${Device.tablet} {
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 0;

  @media ${Device.desktop} {
    font-size: 18px;
  }
`;

const Description = styled.p`
  font-size: 13px;
  margin: 5px 0 0;

  @media ${Device.desktop} {
    font-size: 14px;
  }
`;

const Highlight = styled.span`
  color: #0077ff;
  cursor: pointer;
`;

const RegisterButton = styled.button`
  background-color: #ff6a00;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  align-self: center;
  &:hover {
    background-color: #e65c00;
  }

  @media ${Device.desktop} {
    align-self: flex-start;
    font-size: 16px;
  }
`;

const RightSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  border-left: none;
  margin-top: 20px;

  @media ${Device.desktop} {
    margin-top: 0;
  }
`;

const MockupImage = styled.div`
  width: 250px;
  height: 500px;
  background-color: #e0e0e0;
  border-radius: 20px;
  border: 6px solid #fff;
  position: relative;
  &::before {
    content: "";
    height: 360px;
    width: 360px;
    background-color: rgba(0, 51, 160, 0.1);
    position: absolute;
    z-index: -1;
    margin: auto;
    bottom: 20%;
    left: -60px;
    border-radius: 50%;
    animation: palpitar 3s infinite;
  }
  @keyframes palpitar {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  @media ${Device.desktop} {
    width: 250px;
    height: 500px;
  }
`;

const Footer = styled.div`
  background-color: #0033a0;
  color: white;
  width: 100%;
  text-align: center;
  border-radius: 8px;
  padding: 10px 0 10px 0;
`;

const FooterTitle = styled.h4`
  font-size: 10px;

  @media ${Device.desktop} {
    font-size: 20px;
  }
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media ${Device.desktop} {
    flex-direction: row;
    justify-content: center;
    gap: 40px;
  }
`;

const FooterItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  @media ${Device.desktop} {
    flex-direction: row;
    align-items: center;
    text-align: left;
  }
`;

const FooterIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #fcece4;
  border-radius: 50%;
  img {
    width: 100%;
  }
  @media ${Device.desktop} {
    width: 60px;
    height: 60px;
  }
`;

const FooterText = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTextTitle = styled.h5`
  font-size: 10px;
  margin: 0;

  @media ${Device.desktop} {
    font-size: 16px;
  }
`;

const FooterDescription = styled.p`
  font-size: 13px;

  @media ${Device.desktop} {
    font-size: 14px;
  }
`;
