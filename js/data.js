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
    permitNo:       "BRLO-202604-00000",
    businessName:   "FOODA!",
    catchphrase:    "Your favorite street food, elevated.",
    nature:         "Food Cart / Street Food Stall",
    section:        "Archimedes",
    address:        "CMU Lab Grounds, Booth 1",
    owner:          "StreetFoods, Co.",
    members: [
      { name: "Juan Dela Cruz", isLeader: true  },
      { name: "Maria Santos",   isLeader: false },
      { name: "Pedro Reyes",    isLeader: false },
      { name: "Ana Lim",        isLeader: false },
    ],
    email:          "fooda.brlo@gmail.com",
    payment:        "Cash, GCash",
    products:       "Isaw, Fishball, Kwek-kwek, Kikiam, Betamax — starting at PHP 10",
    logo:           "",
    dateRegistered: "April 11, 2026",
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