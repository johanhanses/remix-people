import type { People } from '@prisma/client'
import { useFetcher } from '@remix-run/react'

interface PersonItemProps {
  person: People
}

export const PersonItem = ({ person }: PersonItemProps) => {
  const fetcher = useFetcher()

  const isDeleting =
    (fetcher.state === 'submitting' || fetcher.state === 'loading') &&
    fetcher.formData?.get('id') === person.id.toString()

  const isFailedDelete = fetcher.data?.error

  return (
    <li key={person.id} style={{ color: isFailedDelete ? 'red' : null }} hidden={isDeleting}>
      {person.firstName} {person.lastName}{' '}
      <fetcher.Form style={{ display: 'inline' }} method="POST">
        <input type="hidden" name="id" value={person.id} />
        <button type="submit" aria-label="delete" name="_action" value="delete">
          {isFailedDelete ? 'Retry' : '✖️'}
        </button>
      </fetcher.Form>
    </li>
  )
}
