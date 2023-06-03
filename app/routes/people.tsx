import { useLoaderData } from '@remix-run/react'
import { prisma } from 'lib/prisma'

export async function loader() {
  const people = await prisma.people.findMany()
  return people
}

export default function People() {
  const people = useLoaderData<typeof loader>()

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>People</h1>
      {people.length ? (
        <ul>
          {people.map((person) => (
            <li key={person.id}>
              {person.firstName} {person.lastName}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nobody here!</p>
      )}
    </main>
  )
}
