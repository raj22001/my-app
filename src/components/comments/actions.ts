"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { PostData, getCommentDataInclude } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";

export async function submitComment({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  console.log({post})
  console.log({content})

  const { content: contentValidated } = createCommentSchema.parse({ content });

  const newComment = await prisma.comment.create({
    data: {
      content: contentValidated,
      userId: user.id,
      postId: post.id,
    },
    include: getCommentDataInclude(user.id),
  });

  console.log("new comment count check" ,newComment.user._count)
  return newComment;


}

export async function deleteComment(id: string){
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw Error("Comment not found");

  if (comment.userId !== user.id) throw Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
