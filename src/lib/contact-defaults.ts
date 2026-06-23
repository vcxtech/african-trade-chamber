import type { ContactPageData } from '@/types/contact-page'
import { defaultContactSocialLinks } from '@/lib/social-links-defaults'

const WP = 'https://africantradechamber.org/wp-content/uploads'

export const defaultContactPage: ContactPageData = {
  introTitle: 'Contact',
  introBody:
    "We'd love to hear from you. Whether you have a question about membership, programs, events, or partnerships, our team is here to help you connect with the right people and information.",
  introImageUrl: `${WP}/2025/11/96881.jpg`,
  introImageAlt: 'Contact ATC',
  email: 'info@africantradechamber.org',
  phone: '+233 505 36 6251',
  address: 'African Trade Chamber\nNo. 5 Teinor Street, Dzorwulu,\nAccra, Ghana',
  officeHours:
    'Monday - Friday: 8:30 AM - 5:00 PM\nSaturday: 9:00 AM - 1:00 PM\nSunday: Closed',
  formBlurbTitle: 'Send Us a Message',
  formBlurbText:
    'Use our online contact form to send us a message directly. We typically respond within 1-2 business days.',
  formTitle: 'Contact Us',
  formSubtitle: 'Fill out the form below and our team will get back to you shortly.',
  formEmail: 'info@africantradechamber.org',
  submitButtonText: 'Send Message',
  subjectOptions: [
    'General Inquiry',
    'Membership',
    'Partnerships',
    'Events',
    'Media',
    'Other',
  ],
  locationTitle: 'Office Locations',
  locationIntro:
    "Our headquarters in Accra serves as the central coordination hub for all ATC activities across the continent. We're conveniently located in the Dzorwulu business district with easy access from all parts of the city.",
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.51217520653!2d-0.1968324854337!3d5.6041670959789565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9a8a60a8041d%3A0x8988d43663e2fd0a!2sDzorwulu%2C%20Accra!5e0!3m2!1sen!2sgh!4v1619443437703!5m2!1sen!2sgh',
  socialTitle: 'Connect With Us',
  socialIntro: 'Follow us for the latest news and updates:',
  socialLinks: defaultContactSocialLinks,
  newsletterTitle: 'Newsletter Signup',
  newsletterBody:
    'Stay informed with ATC updates, trade insights, event announcements, and member news. Subscribe to our newsletter and receive curated content directly in your inbox.',
  newsletterSubmitLabel: 'Subscribe',
  newsletterSuccessMessage:
    'Thank you for subscribing. You will receive our next newsletter soon.',
}
