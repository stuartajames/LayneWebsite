import type { Review, ReviewAggregate } from '@/types'

export const MOCK_AGGREGATE: ReviewAggregate = {
  overallStars: 4.9,
  reviewCount: 76,
  profileUrl:
    'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview',
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'mock-1',
    source: 'ratemyagent',
    author: 'Chrissy Bell',
    rating: 5,
    body: 'Layne was professional, reassuring and very friendly. She was truthful. I was totally at ease with her and trusted her. She delivered as promised so would definitely recommend her to family and friends. Thanks Layne',
    date: '2026-04-24',
    isRecommended: true,
    reviewUrl:
      'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview',
  },
  {
    id: 'mock-2',
    source: 'ratemyagent',
    author: 'Seller',
    rating: 5,
    body: 'With her enthusiasm, positivity, sound advice, and attention for detail, Layne made selling our lovely home a smooth process with an outcome we are very happy with. We worked well together to create a plan that suited our circumstances, and it went as we had hoped for, selling within 5 weeks.\nLayne is a lovely and caring person, who easily connects with people. She was thorough in following up with interested parties and provided us with regular updates where things were at. As far as we can tell, Layne is very good at getting to know and supporting potential buyers. This resulted in a very quick negotiation process to finalise the sale after the tender. We can highly recommend Layne!',
    date: '2026-04-21',
    isRecommended: true,
    reviewUrl:
      'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview',
  },
  {
    id: 'mock-3',
    source: 'ratemyagent',
    author: 'Michael Bell',
    rating: 5,
    body: 'Layne was great with sound advice and very helpful with making sure the house was ready to sell.',
    date: '2026-04-19',
    isRecommended: true,
    reviewUrl:
      'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview',
  },
  {
    id: 'mock-4',
    source: 'ratemyagent',
    author: 'Alana Peek',
    rating: 5,
    body: 'Layne was so helpful and so lovely in guiding us through the auction process. She was so helpful at the open homes and made the whole process so easy!',
    date: '2026-04-19',
    isRecommended: true,
    reviewUrl:
      'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview',
  },
  {
    id: 'mock-5',
    source: 'ratemyagent',
    author: 'Seller',
    rating: 4,
    body: 'As agent for the sale of my aunt\'s estate Layne and the Harcourts Khandallah team brought a thorough understanding of the local market, gave sound advice about how to prepare the property for sale and the method of sale (auction), conceived a unique marketing pitch (nearly 7000 views on TradeMe), and without fuss achieved an outstanding outcome in a challenging market.',
    date: '2026-03-15',
    isRecommended: true,
    reviewUrl:
      'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview',
  },
  {
    id: 'mock-6',
    source: 'ratemyagent',
    author: 'Buyer',
    rating: 5,
    body: 'Layne was wonderful to work with. Her manner was very professional and she responded to my plethora of calls, texts, and e-mails quickly. Her genuine warmth and enthusiasm really shone through. Thank you for helping me find the house of my dreams, Layne!',
    date: '2026-03-08',
    isRecommended: true,
    reviewUrl:
      'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview',
  },
  {
    id: 'mock-7',
    source: 'ratemyagent',
    author: 'Elizabeth Moloney-Geany',
    rating: 5,
    body: 'Layne was so helpful every step of the way and happy to help out with paperwork or staging - all the little things to make the process easier for us! Would highly recommend Layne to anyone considering selling. Thanks again!',
    date: '2026-03-07',
    isRecommended: true,
    reviewUrl:
      'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview',
  },
  {
    id: 'mock-8',
    source: 'ratemyagent',
    author: 'Ben Burns',
    rating: 5,
    body: 'Layne was great to deal with. Punctual and nothing seemed to be an issue. She got the best result for all involved. Look forward to dealing with her next time.',
    date: '2026-03-02',
    isRecommended: true,
    reviewUrl:
      'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview',
  },
  {
    id: 'mock-9',
    source: 'ratemyagent',
    author: 'Oskar Larsson',
    rating: 5,
    body: 'Very welcoming and knowledgeable at open homes and private viewing. Fast, clear communications throughout and great result!',
    date: '2026-02-23',
    isRecommended: true,
    reviewUrl:
      'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview',
  },
  {
    id: 'mock-10',
    source: 'ratemyagent',
    author: 'Hadleigh Pedler',
    rating: 5,
    body: 'We were very impressed by Layne\'s professionalism, responsiveness, enthusiasm, hard work and flair. She put in a lot of work to market and promote our home, above and beyond what we expected. Layne was always quick to respond and pass on information, gave us good advice and was always friendly and easy to deal with. The end result was a good outcome for us.',
    date: '2026-02-22',
    isRecommended: true,
    reviewUrl:
      'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview',
  },
  {
    id: 'mock-11',
    source: 'ratemyagent',
    author: 'Henry Popplewell',
    rating: 5,
    body: 'Layne impressed from day one with her clear, upfront and positive approach to engaging with us.\n\nLayne is a passionate and talented marketer of a property. Providing careful thought, local knowledge and unique and impactful execution to the campaign. And she kept us informed every step of the way, achieving an outcome and interest beyond what I had hoped and expected.\n\nI would 100% recommend Layne to anyone looking to sell their home.',
    date: '2026-02-22',
    isRecommended: true,
    reviewUrl:
      'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview',
  },
  {
    id: 'mock-12',
    source: 'ratemyagent',
    author: 'Josh',
    rating: 5,
    body: "I couldn't have asked for a better real estate agent. Layne went above and beyond at every step. Despite things being a bit challenging with my relocation to Auckland, she was always available when needed and guided me through the entire process, answering all of my questions along the way. She took the stress out of everything and made the experience seamless. The property sold far quicker than I expected. It was a pleasure meeting and working with her, and I would happily use her again if I own property in Wellington.",
    date: '2026-01-19',
    isRecommended: true,
    reviewUrl:
      'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview',
  },
]
