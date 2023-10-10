import { CategoryEnum } from "@prisma/client";

export default function Category({ 
  className,
  handleChangeCategory,
  selected,
} : {
  className?: string,
  handleChangeCategory: (category: string) => void,
  selected: string,
}) {
  className += " outline-none"
  const options = Object.keys(CategoryEnum).map((category, index) => {
    return (
      <option
        key={index} 
        value={category}
      >
        {category}
      </option>
    );
  });

  return (
    <select 
      id="category"
      name="category"
      className={className}
      onChange={(e) => handleChangeCategory(e.target.value)}
      value={selected}
    >
      {options}
    </select>
  );
}