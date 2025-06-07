import {
  documentToReactComponents,
  type Options,
} from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import { faExternalLinkAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { useState } from 'react'
import { graphQLQuery } from '#app/shared/graphQLQuery'
import { ANNU, asserts } from '#app/shared/utils'
import { type Route } from './+types/guestbook'
import { getGuestbookPage } from './guestbook/guestbook.graphql'
import GuestbookForm from './guestbook/guestbookForm'
import { Title } from './shared/Title'

export async function loader() {
  const data = await graphQLQuery(getGuestbookPage)

  ANNU(
    data.goldenBookCollection,
    'The data for the guestbook page has not been provided!',
  )

  asserts(
    data.goldenBookCollection.total < 1000,
    'Number of guestbook entries exceeds 1000! Time to paginate!',
  )

  return data.goldenBookCollection
}

const formVariants: Variants = {
  hidden: {
    height: 0,
  },

  visible: {
    height: 'auto',
    transition: {
      type: 'just',
    },
  },
}

const buttonVariants: Variants = {
  hidden: {
    height: 0,
    transition: {
      type: 'just',
    },
  },

  visible: {
    height: 'auto',
  },
}

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_, children) => (
      <p className="my-4 italic">{children}</p>
    ),
  },
} as const satisfies Options

export default function Guestbook({
  loaderData: { items },
}: Route.ComponentProps) {
  const [displayForm, setDisplayForm] = useState(false)

  return (
    <>
      <Title title="Livre d'Or" />
      <section className="my-4 mx-auto max-w-[680px] flex flex-col gap-4">
        <AnimatePresence>
          {displayForm && (
            <motion.section
              className="overflow-hidden"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <GuestbookForm />
            </motion.section>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!displayForm && (
            <motion.section
              className="overflow-hidden self-end"
              variants={buttonVariants}
              initial={false}
              animate="visible"
              exit="hidden"
            >
              <button
                className="uppercase bg-[#7f7f7f] text-white rounded-sm p-2 mt-2 self-start text-sm hover:bg-[#4f4f4f] cursor-pointer"
                onClick={() => setDisplayForm(true)}
              >
                <span>Laisser un message</span>
              </button>
            </motion.section>
          )}
        </AnimatePresence>
        {items
          .filter((item): item is NonNullable<typeof item> => item !== null)
          .map((item, i) => (
            <section
              key={i}
              className="grid grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_auto] p-4 bg-base-90"
            >
              <FontAwesomeIcon
                className="col-start-1 row-start-1 text-2xl"
                icon={faUser}
              />
              <h2 className="col-start-2 row-start-1 mx-2 text-2xl font-light flex items-center gap-4">
                {item.name}
                {item.website && (
                  <a className="text-xs" href={item.website}>
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                )}
              </h2>
              {item.date && (
                <span className="col-start-1 col-span-2 row-start-2 text-xs">
                  {new Date(item.date).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
              {item.comment && (
                <div className="col-start-1 col-span-2 row-start-3 text-sm">
                  {documentToReactComponents(item.comment.json, options)}
                </div>
              )}
            </section>
          ))}
      </section>
    </>
  )
}
