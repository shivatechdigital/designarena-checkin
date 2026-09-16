# Checkinn Homes SEO Copy-Paste Guide

Use this document in `Admin -> SEO`. Each page has its own tab. Copy the matching values into the fields, then click `Save SEO Settings`.

## Before You Publish

- Replace `https://demo.checkinnhomes.com` with the final domain if this becomes the production domain.
- Use only facts that are visible on the page and true for the property.
- Keep exactly one visible H1 on each page.
- Do not use `noindex,nofollow` for public pages.
- Use an actual horizontal property photo for the Open Graph image. Recommended size: `1200 x 630` pixels.
- The JSON-LD schema must remain valid JSON. Do not add trailing commas.

## Home

**SEO Title**

```text
Checkinn Homes | Hotel Stay in Upper Tapovan, Rishikesh
```

**Meta Description**

```text
Book a comfortable stay at Checkinn Homes in Upper Tapovan, Rishikesh. Explore rooms, flexible meal plans, guest reviews and direct booking options.
```

**Focus Keyword**

```text
hotel stay in Upper Tapovan Rishikesh
```

**Canonical Path**

```text
/
```

**Robots**

```text
index,follow
```

**Primary H1**

```text
Comfortable Stay in Upper Tapovan, Rishikesh
```

**Content / Internal Linking Notes**

```text
Explain the property location near Upper Tapovan and who the stay suits. Link naturally to Rooms for accommodation choices, Gallery for images, Guest Stories for reviews, and Contact for questions. Include a clear direct booking call to action.
```

**Open Graph Image URL**

```text
https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01209-2-1024x683.jpg
```

**JSON-LD Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Checkinn Homes",
  "url": "https://demo.checkinnhomes.com/",
  "description": "Comfortable accommodation in Upper Tapovan, Rishikesh with direct booking options.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Secret Waterfall Rd, Upper Tapovan",
    "addressLocality": "Rishikesh",
    "addressRegion": "Uttarakhand",
    "postalCode": "249192",
    "addressCountry": "IN"
  },
  "telephone": "+91 82793 09665",
  "email": "checkinnhomes@gmail.com"
}
```

## Rooms

**SEO Title**

```text
Rooms in Upper Tapovan, Rishikesh | Checkinn Homes
```

**Meta Description**

```text
Explore rooms at Checkinn Homes in Upper Tapovan, Rishikesh. Choose room-only, breakfast or meal plans and book your preferred stay directly.
```

**Focus Keyword**

```text
rooms in Upper Tapovan Rishikesh
```

**Canonical Path**

```text
/rooms
```

**Robots**

```text
index,follow
```

**Primary H1**

```text
Rooms and Stay Plans in Upper Tapovan, Rishikesh
```

**Content / Internal Linking Notes**

```text
Keep each room name, capacity, amenities, photos and Room Only, Breakfast and Meal plan pricing accurate. Link to Gallery for room images, Contact for group-stay questions, and Home for the property overview.
```

**Open Graph Image URL**

```text
https://checkinnhomes.com/wp-content/uploads/2026/03/premium.jpeg
```

**JSON-LD Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Rooms at Checkinn Homes",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Premium Room"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Super Deluxe Room"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Deluxe Room"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Shared Dormitory Room"
    }
  ]
}
```

## About Us

**SEO Title**

```text
About Checkinn Homes | Upper Tapovan, Rishikesh Stay
```

**Meta Description**

```text
Learn about Checkinn Homes, a comfortable stay in Upper Tapovan, Rishikesh near local cafes, yoga studios and the Secret Waterfall trail.
```

**Focus Keyword**

```text
stay in Upper Tapovan Rishikesh
```

**Canonical Path**

```text
/aboutus
```

**Robots**

```text
index,follow
```

**Primary H1**

```text
About Checkinn Homes in Upper Tapovan, Rishikesh
```

**Content / Internal Linking Notes**

```text
Describe the property, location and guest experience truthfully. Mention nearby places only when accurate. Link to Rooms, Gallery, Guest Stories and Contact using descriptive anchor text.
```

**Open Graph Image URL**

```text
https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01209-2-1024x683.jpg
```

**JSON-LD Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Checkinn Homes",
  "url": "https://demo.checkinnhomes.com/aboutus",
  "mainEntity": {
    "@type": "LodgingBusiness",
    "name": "Checkinn Homes",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Rishikesh",
      "addressRegion": "Uttarakhand",
      "addressCountry": "IN"
    }
  }
}
```

## Gallery

**SEO Title**

```text
Checkinn Homes Gallery | Rooms and Stay in Rishikesh
```

**Meta Description**

```text
View photos and videos of Checkinn Homes, including rooms, shared spaces and the Upper Tapovan, Rishikesh surroundings.
```

**Focus Keyword**

```text
Checkinn Homes Rishikesh gallery
```

**Canonical Path**

```text
/gallery
```

**Robots**

```text
index,follow
```

**Primary H1**

```text
Checkinn Homes Gallery
```

**Content / Internal Linking Notes**

```text
Use meaningful image alt text such as "Premium Room at Checkinn Homes in Upper Tapovan". Do not use generic alt text like "image 1". Link to Rooms for availability and booking plan details.
```

**Open Graph Image URL**

```text
https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01206-scaled.jpg
```

**JSON-LD Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Checkinn Homes Gallery",
  "url": "https://demo.checkinnhomes.com/gallery",
  "description": "Photos and videos of rooms and spaces at Checkinn Homes in Rishikesh."
}
```

## Guest Stories

**SEO Title**

```text
Guest Reviews for Checkinn Homes | Rishikesh Stay
```

**Meta Description**

```text
Read guest stories and reviews for Checkinn Homes in Upper Tapovan, Rishikesh. Share your stay experience with future guests.
```

**Focus Keyword**

```text
Checkinn Homes Rishikesh reviews
```

**Canonical Path**

```text
/feedback
```

**Robots**

```text
index,follow
```

**Primary H1**

```text
Guest Stories from Checkinn Homes
```

**Content / Internal Linking Notes**

```text
Publish only genuine guest feedback. Do not add review schema ratings unless the displayed rating and review data are complete and meet Google structured data policies. Link to Rooms and Contact.
```

**Open Graph Image URL**

```text
https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01304-scaled.jpg
```

**JSON-LD Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Guest Stories from Checkinn Homes",
  "url": "https://demo.checkinnhomes.com/feedback",
  "description": "Guest stories and stay feedback for Checkinn Homes in Rishikesh."
}
```

## Contact

**SEO Title**

```text
Contact Checkinn Homes | Book Your Rishikesh Stay
```

**Meta Description**

```text
Contact Checkinn Homes in Upper Tapovan, Rishikesh for room bookings, availability, direct stay questions and travel assistance.
```

**Focus Keyword**

```text
contact hotel in Upper Tapovan Rishikesh
```

**Canonical Path**

```text
/contact
```

**Robots**

```text
index,follow
```

**Primary H1**

```text
Contact Checkinn Homes in Upper Tapovan, Rishikesh
```

**Content / Internal Linking Notes**

```text
Keep phone, email, WhatsApp, address and map accurate. Link to Rooms for booking choices and Home for the property overview. Include clear response expectations only when the team can meet them.
```

**Open Graph Image URL**

```text
https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01298-scaled.jpg
```

**JSON-LD Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact Checkinn Homes",
  "url": "https://demo.checkinnhomes.com/contact",
  "mainEntity": {
    "@type": "LodgingBusiness",
    "name": "Checkinn Homes",
    "telephone": "+91 82793 09665",
    "email": "checkinnhomes@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Secret Waterfall Rd, Upper Tapovan",
      "addressLocality": "Rishikesh",
      "addressRegion": "Uttarakhand",
      "postalCode": "249192",
      "addressCountry": "IN"
    }
  }
}
```

## After Saving Every Page

1. Open the clean URL in an incognito browser.
2. View page source and verify one `<title>`, one meta description, canonical URL, robots value and JSON-LD block.
3. Confirm the visible H1 supports the saved SEO title and keyword.
4. Test every internal navigation link from that page.
5. Submit `https://demo.checkinnhomes.com/sitemap.xml` to Google Search Console after verifying the final production domain.

## Site-Wide SEO Checklist

- Every public page uses its clean URL, not `.html`.
- `https://demo.checkinnhomes.com/robots.txt` and `/sitemap.xml` return successfully.
- Public pages use `index,follow`; `/admin` remains blocked from crawling.
- Property address, email, phone and WhatsApp number are consistent across the website and Google Business Profile.
- Each room photo uses descriptive ALT text and loading is lazy below the fold.
- Do not claim ratings, awards, distances, facilities or policies that are not true.
- Add a Privacy Policy and Terms page before running paid campaigns or collecting significant customer data.
