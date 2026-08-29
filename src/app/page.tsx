import { Row, Container, Col } from "@/components/grid";
import Image from "next/image";
import heroImage from "@/resources/images/blurred-ui.png";
import { styled } from "styled-components";

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
              <h1>Welcome to Our Site</h1>
              <p>This is a simple hero section.</p>
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
