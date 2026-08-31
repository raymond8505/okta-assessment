import { Row, Container, Col } from "@/components/grid";
import Image from "next/image";
import heroImage from "@/resources/images/blurred-ui.png";
import { styled } from "styled-components";
import { theme } from "@/styles/theme";
import { H1, H2 } from "@/components/primitives/headings/headings";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { QuoteCarousel } from "@/components/quote-carousel/QuoteCarousel";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/primitives/buttons";
import { FAQAccordion } from "@/components/faq-accordion/FAQAccordion";

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

/*
 * clip, not hidden: hidden would make the Row a scroll container and break
 * position:sticky descendants. Without it the overflow-mode previews widen
 * the page on screens narrower than the Container max-width.
 */
const QuotesRow = styled(Row)`
  margin: ${theme.space[9]} 0 0;
  overflow-x: clip;
`;

const FAQRow = styled(Row)`
  margin: ${theme.space[9]} 0;
`;

/* Zero side padding so the overflow previews spill past the Container edge. */
const QuotesContainer = styled(Container)`
  padding-left: 0;
  padding-right: 0;
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

      <QuotesRow>
        <QuotesContainer>
          <QuoteCarousel height="70vh" mode="overflow" />
        </QuotesContainer>
      </QuotesRow>

      <FAQRow>
        <Container>
          <Row>
            <Col $sm={12} $lg={6}>
              <H2>Frequently asked questions</H2>
              <p>
                Itaque earum rerum hic tenetur a sapiente delectus, ut aut
                reiciendis voluptatibus maiores alias consequatur aut
                perferendis.
              </p>
            </Col>
            <Col $sm={12} $lg={6}>
              <FAQAccordion headingLevel={3} defaultExpandedIndex={0} />
            </Col>
          </Row>
        </Container>
      </FAQRow>
    </main>
  );
}
