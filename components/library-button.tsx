"use client"

import React from "react"

type LibraryButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  variant: "add" | "edit" | "remove"
}

export default function LibraryButton({
  children,
  onClick,
  variant,
}: LibraryButtonProps) {
  let baseStyle =
    "px-4 py-2 rounded-lg text-white text-sm font-medium transition"

  let variantStyle = ""

  if (variant === "add") {
    variantStyle = "bg-green-600 hover:bg-green-700"
  }

  if (variant === "edit") {
    variantStyle = "bg-blue-600 hover:bg-blue-700"
  }

  if (variant === "remove") {
    variantStyle = "bg-red-600 hover:bg-red-700"
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyle}`}
    >
      {children}
    </button>
  )
}
