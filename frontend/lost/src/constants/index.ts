// src/constants/index.ts
export interface LostItem {
    id: number;
    title: string;
    image: string;
    contact: string;
    location: string;
    description?: string;
  }
  
  export const dummyItems: LostItem[] = [
    {
      id: 1,
      title: "National Identity Card",
      image: "https://via.placeholder.com/150",
      contact: "+123456789",
      location: "Downtown",
      description: "Found near the central park.",
    },
    {
      id: 2,
      title: "Passport",
      image: "https://via.placeholder.com/150",
      contact: "+987654321",
      location: "Airport",
      description: "Found in the waiting area.",
    },
    {
      id: 3,
      title: "Education Certificate",
      image: "https://via.placeholder.com/150",
      contact: "+1122334455",
      location: "University Campus",
      description: "Found in the library.",
    },
    {
        id: 4,
        title: "Education Certificate",
        image: "https://via.placeholder.com/150",
        contact: "+1122334455",
        location: "University Campus",
        description: "Found in the library.",
      },
      {
        id: 5,
        title: "National Identity Card",
        image: "https://via.placeholder.com/150",
        contact: "+1122334455",
        location: "University Campus",
        description: "Found in the library.",
      },
      {
        id: 6,
        title: "Birth Certificate",
        image: "https://via.placeholder.com/150",
        contact: "+1122334455",
        location: "University Campus",
        description: "Found in the library.",
      },
    // Add more dummy items as needed
  ];
  
  export interface Testimony {
    id: number;
    name: string;
    testimony: string;
  }
  
  
  
  export const dummyTestimonies: Testimony[] = [
    {
      id: 1,
      name: "John Doe",
      testimony: "I found my lost passport thanks to this amazing platform!",
    },
    {
      id: 2,
      name: "Jane Smith",
      testimony: "I was able to retrieve my ID card. Great service!",
    },
    {
      id: 3,
      name: "Imani Mwambelo",
      testimony: "Daaaah hii system imeniokoaa aiseeeee....",
    },
    {
        id: 4,
        name: "Fredrick Mwakalambile",
        testimony: "Ahsante find&retrieve kwa kunisaidia kupata kitambulisho changu cha taifa",
      },
      {
        id: 5,
        name: "Divan Nyangi",
        testimony: "Am just proud of this system....",
      },
    // Add more dummy testimonies as needed
  ];