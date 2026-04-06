/* ═══════════════════════════════════════════════════
   data.js — BRLO Business Data Layer
   ═══════════════════════════════════════════════════
   This file is the single source of truth for all
   registered business entries. To add a new business,
   copy a template block and fill in the fields.

   FIELDS REFERENCE:
     permitNo       — Official BRLO permit number
     businessName   — Registered business name
     catchphrase    — Tagline / slogan (optional)
     nature         — Type / nature of business
     section        — Class section (Archimedes | Aristotle | Galileo | Kepler)
     address        — Booth / establishment address
     owner          — Proprietor / business owner name
     members        — Array of { name, isLeader }
     email          — Business email address
     payment        — Accepted payment methods
     products       — Products or services offered
     logo           — Path to logo image, e.g. "logos/mylogo.png" (leave "" if none)
     dateRegistered — Date approved and registered
   ═══════════════════════════════════════════════════ */

const BUSINESSES = [

  {
    permitNo:       "BRLO-202604-50327",
    businessName:   "Happy Tummy",
    catchphrase:    "",
    nature:         "Online Food / Homemade Food Business",
    section:        "Kepler",
    address:        "Central Mindanao University Laboratory High School, Musuan, Maramag, Bukidnon",
    owner:          "Rhez Aleyah C. Capio",
    members: [
      { name: "Capio, Rhez Aleyah C.", isLeader: false  },
      { name: "Asok, Princess Bianca",   isLeader: false },
      { name: "Alba, Daniela Aurea G.",    isLeader: false },
      { name: "Castillo, Caesar Laurence F.",        isLeader: false },
      { name: "Dinglasa, Maria Leigh Lanie A.",        isLeader: false },
      { name: "Dumandan, Carl Gian",        isLeader: false },
    ],
    email:          "princessbiancaasok@gmail.com",
    payment:        "Cash, GCash",
    products:       "Food options: Mac n Cheese, Chicken Alfredo, and Lasagna",
    logo:           "logo/happy_tummy.jpg",
    dateRegistered: "April 7, 2026",
  },

  {
    permitNo:       "BRLO-202604-24908",
    businessName:   "Bite Me, Baby?",
    catchphrase:    "Lamian nga pagkaon, labaw na ang nagkaon",
    nature:         "Food Cart / Street Food Stall",
    section:        "Archimedes",
    address:        "Near 11-Einstein Classroom, Central Mindanao University Laboratory High School",
    owner:          "Jeffrey III M. Galan",
    members: [
      { name: "Galan, Jeffrey III M.", isLeader: false  },
      { name: "Dinopol, Nolyn Mary A.",   isLeader: false },
      { name: "Guerra, Andre Nathaniel Y.",    isLeader: false },
      { name: "Ilasin, Astrid G.",        isLeader: false },
      { name: "Natividad, Reign P.",        isLeader: false },
      { name: "Ponce, Myrrh Zyrah O.",        isLeader: false },
      { name: "Salupado, Joery Benedict L.",        isLeader: false },
      { name: "Salvador, Princess Mierl D.",        isLeader: false },
      { name: "Tubo, Marc Allen D.",        isLeader: false },
    ],
    email:          "bitemebaby751@gmail.com",
    payment:        "Cash, GCash",
    products:       "Savory:The Messy Hookup (Nachos), Put a Ring on It (Onion Rings) | Sweets: Sugar Daddy Rods (Churros), Creamy Finish (Xiao Long Bao), For E Play (Ube Ricecake Turon) | Beverages: Buko PanDAMN (Buko Pandan), Chill Pill (Iced Tea)",
    logo:           "logo/bite_me_baby.jpg",
    dateRegistered: "April 7, 2026",
  },

  // ── ADD NEW BUSINESSES BELOW ──────────────────────
  // {
  //   permitNo:       "BRLO-202604-XXXXX",
  //   businessName:   "Your Business Name",
  //   catchphrase:    "Your tagline here",
  //   nature:         "Nature of Business",
  //   section:        "Aristotle",
  //   address:        "Booth Location",
  //   owner:          "Owner Full Name",
  //   members: [
  //     { name: "Leader Name",  isLeader: true  },
  //     { name: "Member Name",  isLeader: false },
  //   ],
  //   email:          "email@example.com",
  //   payment:        "Cash, GCash",
  //   products:       "List your products / services here",
  //   logo:           "",
  //   dateRegistered: "April 11, 2026",
  // },
  // ── END OF TEMPLATE ───────────────────────────────

];