import { useFakerApi } from "../hooks/api/useFakerApi";
import styled from "styled-components";

export default function Home() {
  const response = useFakerApi();

  return (
    <StyledContainer>
      {response &&
        response.data.map(({ description, title, url }, i) => (
          <StyledCard key={i}>
            <StyledTitle>{title}</StyledTitle>
            <StyledDescription>{description}</StyledDescription>
            <img src={url} />
          </StyledCard>
        ))}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  grid-auto-rows: minmax(100px, auto);
  width: 100%;
  color: #333;
`;

const StyledCard = styled.div`
  border: solid 1px #333;
  min-height: 300px;
  text-align: center;
`;

const StyledDescription = styled.p`
  font-size: 14px;
`;

const StyledTitle = styled.h2`
  font-size: 18px;
`;
