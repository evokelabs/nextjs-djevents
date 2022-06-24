import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { GetStaticProps, GetStaticPaths } from 'next'
import { FaPencilAlt, FaTimes } from 'react-icons/fa'
import { API_URL } from '@/config/index'
import styles from '@/styles/Event.module.css'
import { useRouter } from 'next/router'

export default function EventPage({ evt }) {
  const router = useRouter()
  const { attributes } = evt
  const deleteEvent = async e => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message)
      } else {
        router.push('/events')
      }
    }
  }

  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}>
            <a>
              <FaPencilAlt /> Edit Event
            </a>
          </Link>
          <a href='#' className={styles.delete} onClick={deleteEvent}>
            <FaTimes /> Delete Event
          </a>
        </div>
        <span>
          {new Date(attributes.date).toLocaleDateString('en-US')} at{' '}
          {attributes.time}
        </span>
        <h1>{attributes.name}</h1>
        <ToastContainer />

        {attributes.image.data && (
          <div className={styles.image}>
            <Image
              src={attributes.image.data.attributes.formats.medium.url}
              width={960}
              height={600}
              alt={attributes.name}
            />
          </div>
        )}
        <h3>Performers:</h3>
        <p>{attributes.performers}</p>
        <h3>Description:</h3>
        <p>{attributes.description}</p>
        <h3>Venue: {attributes.venue}</h3>
        <p>{attributes.address}</p>

        <Link href='/events'>
          <a className={styles.back}>{'<'} Go Back</a>
        </Link>
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/events`)
  const json = await res.json()
  const events = json.data

  const paths = events.map(evt => ({
    params: { slug: evt.attributes.slug }
  }))

  return {
    paths,
    fallback: false
  }
}

// Get Static Props with query & slug
export const getStaticProps: GetStaticProps = async function getStaticProps({
  params: { slug }
}) {
  const res = await fetch(
    `${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=image`
  )
  const json = await res.json()
  const events = json.data

  return {
    props: {
      evt: events[0],
      revalidate: 1
    }
  }
}

//Get Server Side Props with query & slug
// export async function getServerSideProps({ query: { slug } }) {
//   const res = await fetch(`${API_URL}/api/events/${slug}`)
//   const events = await res.json()
//   return {
//     props: {
//       evt: events[0]
//     }
//   }
// }
