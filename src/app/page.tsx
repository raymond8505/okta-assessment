import { Row, Container, Col } from "@/components/grid";
import Image from "next/image";
import heroImage from "@/resources/images/blurred-ui.png";
import { styled } from "styled-components";
import { H2 } from "@/components/headings/headings";

const HeroImage = styled(Image)`
  height: 548px;
  width: auto;
  max-width: 100%;
  object-fit: cover;
`;
export default function HomePage() {
  return (
    <main>
      <Row $hasBackground>
        <Container>
          <Row>
            <Col $md={12} $lg={6}>
              <H2>Lorem ipsum dolor sit amet consect alora</H2>
              <p>
                Adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi.
              </p>
            </Col>
            <Col $md={12} $lg={6}>
              <HeroImage src={heroImage} alt="A blurred mobile app UI" />
            </Col>
          </Row>
        </Container>
      </Row>
    </main>
  );
}
