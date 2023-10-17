import { Quiz } from "@prisma/client";
import { useSession } from "next-auth/react";

export function Actions(
  {
    handleSubmit,
    handleEdit,
    handleDelete,
    quiz,
  }: {
    handleSubmit: () => void,
    handleEdit: () => void,
    handleDelete: () => void,
    quiz: Quiz,
  }
) {
  const session = useSession();
  

  return (
    <div className="flex gap-4 justify-center">

      {session.data && session.data.user && session.data.user.email && session.data.user.email === quiz.ownerEmail && (
        <>
          <button className="btn" onClick={ handleEdit }>
            Edit
          </button>
          <button className="btn" onClick={ handleDelete }>
            Delete
          </button>
        </>
      )}

      <button
        className="btn"
        onClick={handleSubmit}
      >
        Submit Answer
      </button>
    </div>
  );
}
