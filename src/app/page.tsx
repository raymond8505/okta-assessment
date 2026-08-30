import { Row, Container, Col } from "@/components/grid";
import Image from "next/image";
import heroImage from "@/resources/images/blurred-ui.png";
import { styled } from "styled-components";
import { theme } from "@/styles/theme";
import { H1 } from "@/components/primitives/headings/headings";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/primitives/buttons";
import quotes from "@/data/quotes.json";
import { Carousel } from "@/components/carousel/Carousel";
import type {
  CarouselItem,
  CarouselItems,
} from "@/components/carousel/Carousel";

const HeroImage = styled(Image)`
  height: 548px;
  width: auto;
  max-width: 100%;
  object-fit: cover;
`;

const HeroCol = styled(Col)`
  padding: 6% 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const HeroHeading = styled(H1)`
  margin: ${theme.space[4]} 0;
`;

const HeroLead = styled.p`
  font-size: 1.5rem;
  line-height: 1.3;
`;

const CtaRow = styled.div`
  display: flex;
  gap: ${theme.space[4]};
`;

export default function HomePage() {
  return (
    <main>
      <Row $hasBackground aria-labelledby="hero-heading">
        <Container>
          <Row $align="stretch" $justify="between">
            <HeroCol $sm={12} $lg={6}>
              <div>
                <Breadcrumbs
                  items={["Platform or Solution", "Feature or Page Title"]}
                />
                <HeroHeading id="hero-heading">
                  Lorem ipsum dolor sit amet consect alora
                </HeroHeading>
                <HeroLead>
                  Adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi.
                </HeroLead>
              </div>
              <CtaRow>
                <PrimaryButton>Primary CTA</PrimaryButton>
                <SecondaryButton>Secondary CTA</SecondaryButton>
              </CtaRow>
            </HeroCol>
            <Col $sm={12} $lg={6}>
              <HeroImage
                src={heroImage}
                alt="A blurred mobile app UI"
                loading="eager"
              />
            </Col>
          </Row>
        </Container>
      </Row>

      <Row
        aria-label="Some of our favourite quotes"
        style={{ margin: `${theme.space[9]} 0` }}
      ></Row>
    </main>
  );
}
