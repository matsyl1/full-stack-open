import type { CoursePart } from "../types";

interface ContentProps {
  parts: CoursePart[];
};

const Part = ({part}: {part: CoursePart}) => {
  switch (part.kind) {
    case "basic":
      return(
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p><em>{part.description}</em></p>
        </div>
      );
      case "group":
        return(
          <div>
            <h3>{part.name} {part.exerciseCount}</h3>
            <p>Project exercises: {part.groupProjectCount}</p>
          </div>
        );
      case "background":
        return(
          <div>
            <h3>{part.name} {part.exerciseCount}</h3>
            <p><em>{part.description}</em></p>
            <p>{part.backgroundMaterial}</p>
          </div>
        );
      case "special":
        return(
          <div>
            <h3>{part.name} {part.exerciseCount}</h3>
            <p><em>{part.description}</em></p>
            <p>Required skills: {part.requirements.join(', ')}</p>
          </div>
        )
  }
}


const Content = ({parts}: ContentProps) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </>
  );
};

export default Content;