import { useEffect, useState } from 'react'
import style from './TermsAndConditions.module.scss'
import Loader from '@/components/atoms/loader/Loader'
import { legalPagesRepository } from '@/repositories/LegalPagesRepository'

const TermsAndConditions = () => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [termsAndConditions, setTermsAndConditions] = useState<string>('')

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        const type = 'terms-and-conditions'
        const { data } = await legalPagesRepository.show(type)
        
        setTermsAndConditions(data.content)
      } catch (error) {
        console.error('Error fetching data:', error)
        setTermsAndConditions('')
      }

      setLoading(false)
    }

    fetchTermsAndConditions()
  }, [])

  const cleanTerms = termsAndConditions.replace(/<pre>&lt;hr \/&gt;<\/pre>/g, '<hr />')

  return (
    <div className={style.termsAndConditions}>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className={style.content}
            dangerouslySetInnerHTML={{ __html: cleanTerms ?? '' }}
        />
      )}
    </div>
  )
}

export default TermsAndConditions
