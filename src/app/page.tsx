import { Row, Container, Col } from "@/components/grid";
import Image from "next/image";
import heroImage from "@/resources/images/blurred-ui.png";
import { styled } from "styled-components";
import { H2 } from "@/components/primitives/headings/headings";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/primitives/buttons";

const HeroImage = styled(Image)`
  height: 548px;
  width: auto;
  max-width: 100%;
  object-fit: cover;
`;
export default function HomePage() {
  return (
    <main>
      <Row $hasBackground aria-labelledby="hero-heading">
        <Container>
          <Row $align="stretch" $justify="between" $gap={1}>
            <Col
              $sm={12}
              $lg={6}
              style={{
                padding: "6% 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Breadcrumbs
                  items={["Platform or Solution", "Feature or Page Title"]}
                />
                <H2 id="hero-heading" style={{ margin: "1rem 0" }}>
                  Lorem ipsum dolor sit amet consect alora
                </H2>
                <p style={{ fontSize: "1.5rem" }}>
                  Adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <PrimaryButton>Primary CTA</PrimaryButton>
                <SecondaryButton>Secondary CTA</SecondaryButton>
              </div>
            </Col>
            <Col $sm={12} $lg={5}>
              <HeroImage
                src={heroImage}
                alt="A blurred mobile app UI"
                loading="eager"
              />
            </Col>
          </Row>
        </Container>
      </Row>
    </main>
  );
}
