import { QuizFragment } from "./quiz";
import { FillHandler } from "./QuizID";
import { Preformatted } from "./Preformatted";
import { Blank } from "./Blank";


export function PreformattedOrBlank(
  {
    index, fragments, handleFill,
  }: {
    index: number;
    fragments: QuizFragment[];
    handleFill: FillHandler;
  }) {

  if (fragments[index].isBlank) {
    return (<Blank index={index} fragments={fragments} handleFill={handleFill} />);
  } else {
    return (<Preformatted text={fragments[index].value} />);
  }
}
