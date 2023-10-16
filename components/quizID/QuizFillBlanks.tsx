import { QuizFragment } from "./quiz";
import { FillHandler, jetBrainFont } from "./QuizID";
import { PreformattedOrBlank } from "./PreformattedOrBlank";


export function QuizFillBlanks(
  {
    fragments, handleFill,
  }: {
    fragments: QuizFragment[];
    handleFill: FillHandler;
  }
) {
  const items = fragments.map((_item, index) => <PreformattedOrBlank key={index} index={index} fragments={fragments} handleFill={handleFill} />);

  return (
    <div className={`w-full ${jetBrainFont.className}`}>
      {items}
    </div>
  );
}
