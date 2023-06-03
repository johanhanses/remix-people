import type { People } from '@prisma/client'
import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import { prisma } from 'lib/prisma'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { PersonItem } from '~/components/PersonItem'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'People' }]
}

export async function loader() {
  const people = await prisma.people.findMany()
  return people
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const { _action, ...values } = Object.fromEntries(formData)

  if (_action === 'create') {
    const newPerson = await prisma.people.create({
      data: { firstName: values.firstName as string, lastName: values.lastName as string },
    })
    return newPerson
  }

  if (_action === 'delete') {
    try {
      if (Math.random() < 0.5) throw new Error('Häst')
      return prisma.people.delete({ where: { id: parseInt(values.id as string) } })
    } catch (error) {
      return { error: true }
    }
  }
}

export default function PeopleRoute() {
  const people = useLoaderData<typeof loader>()
  const navigating = useNavigation()
  const adding =
    (navigating.state === 'submitting' || navigating.state === 'loading') &&
    navigating.formData?.get('_action') === 'create'
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (adding) {
      formRef.current?.reset()
      formRef.current?.firstName.focus()
    }
  }, [adding])

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>People</h1>

      <ul>
        {people.map((person) => (
          <PersonItem person={person as unknown as People} key={person.id} />
        ))}
        {adding && (
          <li>
            {navigating.formData?.get('firstName') as ReactNode} {navigating.formData?.get('lastName') as ReactNode}
            <button disabled>✖️</button>
          </li>
        )}
      </ul>

      <Form method="POST" ref={formRef}>
        <input type="text" name="firstName" /> <input type="text" name="lastName" />{' '}
        <button type="submit" name="_action" value="create" disabled={adding}>
          {/* {adding ? 'Adding...' : 'Add'} */}
          Add
        </button>
      </Form>
    </main>
  )
}
