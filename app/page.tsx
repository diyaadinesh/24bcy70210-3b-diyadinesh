"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import LibraryButton from "@/components/library-button"

type Book = {
  id: number
  title: string
  author: string
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [books, setBooks] = useState<Book[]>([])
  const [editingId, setEditingId] = useState<Number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editAuthor, setEditAuthor] = useState("")

  // Load books from localStorage on first render
  useEffect(() => {
    const storedBooks = localStorage.getItem("books")
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks))
    }
  }, [])

  // Save books whenever books state changes
  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books))
  }, [books])

  // Filter books based on search query
  const filteredBooks = useMemo(() => {
    return books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
    )
  }, [books, query])

  const handleAdd = () => {
    if (!title.trim() || !author.trim()) return

    const newBook: Book = {
      id: Date.now(),
      title,
      author,
    }

    setBooks([newBook, ...books])
    setTitle("")
    setAuthor("")
  }

  const handleRemove = (id: number) => {
    setBooks(books.filter((book) => book.id !== id))
  }

  const handleEdit = (book: Book) => {
    setEditingId(book.id)
    setEditTitle(book.title)
    setEditAuthor(book.author)
  }

  const handleSaveEdit = (id: number) => {
    if (!editTitle.trim() || !editAuthor.trim()) return

    setBooks(
      books.map((book) =>
        book.id === id
          ? { ...book, title: editTitle, author: editAuthor }
          : book
      )
    )

    setEditingId(null)
    setEditTitle("")
    setEditAuthor("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
    setEditAuthor("")
  }

  return (
    <div className="min-h-screen bg-pink-200 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-700">
          📚 Library Manager
        </h1>

        {/* Search */}
        <Input
          className="border-2 border-red-500 focus:border-red-600"
          placeholder="Search by title or author..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Add Book */}
        <div className="flex gap-2">
          <Input
            className="border-2 border-red-500 focus:border-red-600"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            className="border-2 border-red-500 focus:border-red-600"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <LibraryButton variant="add" onClick={handleAdd}>
            Add
          </LibraryButton>
        </div>

        {/* Books List */}
        {filteredBooks.length === 0 ? (
          <p className="text-center text-gray-500">
            No books found.
          </p>
        ) : (
          filteredBooks.map((book) => (
            <Card key={book.id} className="p-4 space-y-3">
              {editingId === book.id ? (
                <>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <Input
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <LibraryButton
                      variant="add"
                      onClick={() => handleSaveEdit(book.id)}
                    >
                      Save
                    </LibraryButton>
                    <LibraryButton
                      variant="remove"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </LibraryButton>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h2 className="font-semibold">{book.title}</h2>
                    <p className="text-sm text-gray-600">
                      {book.author}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <LibraryButton
                      variant="edit"
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </LibraryButton>
                    <LibraryButton
                      variant="remove"
                      onClick={() => handleRemove(book.id)}
                    >
                      Remove
                    </LibraryButton>
                  </div>
                </>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
