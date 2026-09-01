import { IpoLevelData } from '../types';

export const IPO_LEVELS: IpoLevelData[] = [
  // =========================================================================
  // LEVEL 1: THE LEMONADE STAND — WHAT IS A COMPANY & WHAT ARE SHARES?
  // =========================================================================
  {
    id: 1,
    levelNumber: 1,
    badge: 'LEVEL 1 • THE FOUNDATIONS',
    title: 'What is a Company and What Does Owning Shares Mean?',
    subtitle: 'From a neighbourhood lemonade stand to slices of business ownership.',
    estimatedMinutes: 4,
    runningAnalogyTitle: 'The Lemonade Stand Analogy',
    runningAnalogyText:
      'Imagine you and your friend Maya want to sell fresh lemonade. You need $100 to buy lemons, sugar, cups, and a wooden table. Neither of you has $100 alone. So, you each put in $50. Together, you created a company. Because you each provided half the money, you each own half the business.',
    realWorldExampleTitle: 'Real-World Example: Apple & Microsoft in the Garage',
    realWorldExampleText:
      'Giant companies like Apple and Microsoft started exactly like a lemonade stand. Steve Jobs and Steve Wozniak started by selling personal items to build 50 computer circuit boards. They owned 100% of those first circuit boards.',
    keyConcepts: [
      {
        heading: '1. What is a Company and Profit?',
        body: 'A company is an organization formed to sell products or services to earn money. When sales bring in more money than what you spent on ingredients, the leftover money is called profit.',
        inShortRecap: 'In short: A company sells goods, and profit is the cash left over after paying all costs.',
        jargonTerms: [
          {
            term: 'Company / Business',
            simpleDefinition: 'An organization that creates products or services to earn money.',
            lemonadeAnalogy: 'Your lemonade stand on the street corner.'
          },
          {
            term: 'Profit',
            simpleDefinition: 'The cash left over after paying all business costs.',
            lemonadeAnalogy: 'If you sell $30 worth of lemonade and ingredients cost $10, your profit is $20.'
          }
        ]
      },
      {
        heading: '2. What is Capital?',
        body: 'Before a business can sell anything, it needs money up front. You need money to buy tools and ingredients. This starting fund is called capital. Without capital, a business cannot launch.',
        inShortRecap: 'In short: Capital is the starting money needed to set up and run a business.',
        jargonTerms: [
          {
            term: 'Capital',
            simpleDefinition: 'The upfront money needed to start, run, or expand a business.',
            lemonadeAnalogy: 'The $100 needed for lemons, sugar, and cups before selling your first drink.'
          }
        ]
      },
      {
        heading: '3. What is a Share, Stock, and Equity?',
        body: 'To track who owns the business, the company is divided into equal tiny pieces called shares. If your lemonade business is worth $100 and you divide it into 100 slices, each share is worth $1. Anyone who owns a share is called a shareholder. The total value of all shares combined is called equity.',
        inShortRecap: 'In short: A share is one slice of ownership in a company, and a shareholder is the person who owns it.',
        jargonTerms: [
          {
            term: 'Share (or Stock)',
            simpleDefinition: 'One single unit of ownership in a company.',
            lemonadeAnalogy: 'One of the 100 paper tickets representing 1% of your lemonade stand.'
          },
          {
            term: 'Shareholder',
            simpleDefinition: 'Any person who legally owns at least one share in a company.',
            lemonadeAnalogy: 'You and Maya, because you each hold 50 shares.'
          },
          {
            term: 'Equity',
            simpleDefinition: 'The total value of ownership in a business.',
            lemonadeAnalogy: 'The total $100 value of the stand owned by both partners.'
          }
        ]
      },
      {
        heading: '4. How Do Shareholders Make Money?',
        body: 'Shareholders earn money in two ways. First, through Dividends, where the company shares part of its cash profit with owners. Second, through Capital Gains, where the company grows in value, allowing you to sell your $1 share for $5.',
        inShortRecap: 'In short: You earn money either through cash profit payouts (dividends) or by selling your share for a higher price (capital gain).',
        jargonTerms: [
          {
            term: 'Dividend',
            simpleDefinition: 'A direct cash payment made by a company to its shareholders from profits.',
            lemonadeAnalogy: 'Splitting the $20 daily profit cash: $10 to you and $10 to Maya.'
          },
          {
            term: 'Capital Gain',
            simpleDefinition: 'The profit made when you sell a share for more than what you paid for it.',
            lemonadeAnalogy: 'Your stand becomes famous. You sell your 50 shares for $150, making a $100 gain.'
          }
        ]
      }
    ],
    quickRecapBullets: [
      'A company needs starting money called capital to buy equipment and ingredients.',
      'A company is divided into equal ownership slices called shares.',
      'A shareholder is someone who owns one or more shares in the business.',
      'Owners make money through profit payouts (dividends) or by selling shares at higher prices (capital gains).'
    ],
    diagramType: 'ownership_pie',
    quiz: [
      {
        id: 'q1-1',
        question: 'If a company creates 1,000 total shares and you buy 100 shares, what percentage of the company do you own?',
        options: [
          { id: 'a', text: '1%', isCorrect: false, explanation: '100 divided by 1,000 equals 10%, not 1%.' },
          { id: 'b', text: '10%', isCorrect: true, explanation: 'Correct! 100 shares out of 1,000 total shares represents exactly 10% ownership.' },
          { id: 'c', text: '100%', isCorrect: false, explanation: 'To own 100%, you would need to own all 1,000 shares.' }
        ]
      },
      {
        id: 'q1-2',
        question: 'What is the upfront money needed to start a business or purchase equipment called?',
        options: [
          { id: 'a', text: 'Dividend', isCorrect: false, explanation: 'A dividend is profit paid back to shareholders, not the starting money.' },
          { id: 'b', text: 'Capital', isCorrect: true, explanation: 'Correct! Capital is the initial money required to fund business operations.' },
          { id: 'c', text: 'Revenue', isCorrect: false, explanation: 'Revenue is total money from sales, not starting funds.' }
        ]
      },
      {
        id: 'q1-3',
        question: 'How do you earn a "Capital Gain" on a stock you own?',
        options: [
          { id: 'a', text: 'By receiving a bank prize', isCorrect: false, explanation: 'Bank rewards are not capital gains on stock.' },
          { id: 'b', text: 'By selling the share at a higher price than what you paid', isCorrect: true, explanation: 'Correct! Capital gain is the profit earned when an asset increases in value.' },
          { id: 'c', text: 'By working as a cashier in the shop', isCorrect: false, explanation: 'That is a salary, not a capital gain.' }
        ]
      }
    ]
  },

  // =========================================================================
  // LEVEL 2: THE TEA SHOP CHAIN — WHY DO COMPANIES GO PUBLIC?
  // =========================================================================
  {
    id: 2,
    levelNumber: 2,
    badge: 'LEVEL 2 • THE BIG LEAP',
    title: 'Why Do Companies Go Public?',
    subtitle: 'From a single popular shop to a nationwide chain: the funding dilemma.',
    estimatedMinutes: 5,
    runningAnalogyTitle: 'The Chai Haven Story',
    runningAnalogyText:
      'Rahul starts a small specialty tea shop called "Chai Haven". It is very popular and earns $50,000 profit a year. Rahul wants to open 50 new tea shops across the country. Opening 50 shops will cost $5,000,000. Rahul does not have $5 million, and banks will not lend that much without huge collateral.',
    realWorldExampleTitle: 'Real-World Example: Zomato, Domino’s & Starbucks',
    realWorldExampleText:
      'When restaurant and retail chains want to expand across an entire country, founder savings are not enough. Companies like Starbucks and Zomato went public to raise hundreds of millions of dollars from everyday citizens.',
    keyConcepts: [
      {
        heading: '1. Private Company vs. Public Company',
        body: 'A Private Company is owned by a small, closed group of people. Its shares cannot be bought by the public. A Public Company lists its shares on a Stock Exchange. A stock exchange is a regulated marketplace where anyone in the general public can buy and sell shares easily.',
        inShortRecap: 'In short: Private companies are owned by a small group; public companies let anyone buy shares on a stock exchange.',
        jargonTerms: [
          {
            term: 'Private Company',
            simpleDefinition: 'A business whose shares are held privately and cannot be bought by the public.',
            lemonadeAnalogy: 'Rahul’s single tea shop owned strictly by Rahul and his brother.'
          },
          {
            term: 'Public Company',
            simpleDefinition: 'A corporation whose shares are listed on an open stock exchange for anyone to trade.',
            lemonadeAnalogy: 'Chai Haven after inviting thousands of everyday citizens to become co-owners.'
          },
          {
            term: 'Stock Exchange',
            simpleDefinition: 'A regulated marketplace where shares of public companies are traded (e.g. NSE, BSE, NYSE).',
            lemonadeAnalogy: 'The central market hall where people buy and sell shop shares.'
          }
        ]
      },
      {
        heading: '2. Debt Financing vs. Equity Financing',
        body: 'To raise $5,000,000, a business has two choices. First, Debt Financing (borrowing a loan). Loans require mandatory monthly interest payments even if sales drop. Second, Equity Financing (selling new shares). Equity brings in co-owners who share business risk. You never have to pay back monthly loan interest.',
        inShortRecap: 'In short: Loans require fixed interest payments; equity sells ownership shares without taking on debt.',
        jargonTerms: [
          {
            term: 'Debt Financing (Loan)',
            simpleDefinition: 'Borrowing money that must be repaid with interest, regardless of business success.',
            lemonadeAnalogy: 'Borrowing $1,000 from a bank with a promise to pay back $1,100 next month.'
          },
          {
            term: 'Equity Financing',
            simpleDefinition: 'Raising money by selling ownership shares in the company.',
            lemonadeAnalogy: 'Inviting 50 neighbours to each pay $100 for a 1% share in the new tea chain.'
          }
        ]
      },
      {
        heading: '3. What is an IPO and Why Early Investors Want an Exit?',
        body: 'An Initial Public Offering (IPO) is the very first time a private company sells shares to the general public. Before an IPO, early investors called Venture Capitalists gave the founder starting funds. An IPO gives these early backers an "Exit" (liquidity). Liquidity means being able to turn shares into cash quickly by selling them on the stock market.',
        inShortRecap: 'In short: An IPO is the first public share sale, providing expansion funds and letting early investors cash out.',
        jargonTerms: [
          {
            term: 'Initial Public Offering (IPO)',
            simpleDefinition: 'The very first sale of company shares to the public stock market.',
            lemonadeAnalogy: 'The historic day Chai Haven opens share ownership to the entire country.'
          },
          {
            term: 'Liquidity',
            simpleDefinition: 'How quickly and easily an asset or share can be converted into cash.',
            lemonadeAnalogy: 'Selling your tea shop share in 2 seconds on a phone app instead of searching for private buyers for months.'
          }
        ]
      }
    ],
    quickRecapBullets: [
      'Private companies are owned by a small group; public companies trade on open stock exchanges.',
      'Equity financing raises expansion funds by selling shares without monthly loan interest burdens.',
      'An IPO is the very first time a private company sells shares to the public.',
      'An IPO provides liquidity, allowing early investors and founders to convert shares into cash.'
    ],
    diagramType: 'private_vs_public',
    quiz: [
      {
        id: 'q2-1',
        question: 'What does "IPO" stand for?',
        options: [
          { id: 'a', text: 'Internal Product Operation', isCorrect: false, explanation: 'IPO stands for Initial Public Offering.' },
          { id: 'b', text: 'Initial Public Offering', isCorrect: true, explanation: 'Correct! Initial Public Offering is the first time shares are offered to the public.' },
          { id: 'c', text: 'International Profit Organization', isCorrect: false, explanation: 'IPO specifically refers to offering shares to the public.' }
        ]
      },
      {
        id: 'q2-2',
        question: 'Why might a growing business choose Equity Financing (IPO) over a Bank Loan (Debt)?',
        options: [
          { id: 'a', text: 'Equity does not require fixed monthly interest repayments during tough times', isCorrect: true, explanation: 'Correct! Equity investors share business risk and do not demand fixed loan interest.' },
          { id: 'b', text: 'Bank loans are free money', isCorrect: false, explanation: 'Bank loans carry strict interest and collateral obligations.' },
          { id: 'c', text: 'Companies are legally forbidden from taking loans', isCorrect: false, explanation: 'Companies can take loans, but large expansions often need equity.' }
        ]
      },
      {
        id: 'q2-3',
        question: 'What is the main benefit of "Liquidity" for an investor who owns shares in a public company?',
        options: [
          { id: 'a', text: 'They can sell their shares for cash almost instantly on a stock exchange', isCorrect: true, explanation: 'Correct! Liquidity means you can easily sell shares for cash anytime.' },
          { id: 'b', text: 'They receive free products for life', isCorrect: false, explanation: 'Ownership of shares does not guarantee free store products.' },
          { id: 'c', text: 'They cannot sell their shares for 50 years', isCorrect: false, explanation: 'Public markets offer high liquidity, allowing easy buying and selling.' }
        ]
      }
    ]
  },

  // =========================================================================
  // LEVEL 3: THE IPO FACTORY — HOW AN IPO ACTUALLY WORKS
  // =========================================================================
  {
    id: 3,
    levelNumber: 3,
    badge: 'LEVEL 3 • THE PROCESS',
    title: 'How an IPO Actually Works: Behind the Scenes',
    subtitle: 'From hiring investment bankers to filing the DRHP and building the book.',
    estimatedMinutes: 5,
    runningAnalogyTitle: 'Preparing Chai Haven for the Big Stage',
    runningAnalogyText:
      'Rahul cannot simply post on social media saying "Buy my tea shares!". He must follow strict legal steps. He hires financial experts to check his books, writes a giant rulebook describing every risk, and invites the public to bid within a price range.',
    realWorldExampleTitle: 'Real-World Example: Tech Giants Filing Their IPOs',
    realWorldExampleText:
      'Before going public, companies like Airbnb and Snowflake worked with investment bankers for nearly a year. They filed hundreds of pages of financial reports so investors knew exactly how much money they made and lost.',
    keyConcepts: [
      {
        heading: '1. Investment Bankers (Underwriters)',
        body: 'The first step is hiring an Investment Bank. Investment bankers (also called Underwriters) are financial specialists. They calculate how much the company is worth, help write legal documents, and find big institutional buyers.',
        inShortRecap: 'In short: Underwriters are financial experts hired to price the company and manage the IPO.',
        jargonTerms: [
          {
            term: 'Underwriter / Investment Banker',
            simpleDefinition: 'A financial institution hired to value the company, handle legal paperwork, and manage the share sale.',
            lemonadeAnalogy: 'A trusted business advisor hired to inspect Chai Haven and organize the public sale.'
          }
        ]
      },
      {
        heading: '2. The DRHP (Draft Red Herring Prospectus)',
        body: 'Next, the company must write an official disclosure book called the Draft Red Herring Prospectus (DRHP). The DRHP is a comprehensive document that reveals company accounts, promoter backgrounds, and business risks. A government agency called the market regulator reviews the DRHP to protect investors from false claims.',
        inShortRecap: 'In short: The DRHP is the official disclosure booklet explaining the company’s financials and risks.',
        jargonTerms: [
          {
            term: 'DRHP (Draft Red Herring Prospectus)',
            simpleDefinition: 'The official document filed with regulators that details company financials, management, and risk factors.',
            lemonadeAnalogy: 'A detailed manual showing every tea recipe, monthly ingredient bill, and potential risk.'
          },
          {
            term: 'Regulator (e.g. SEBI / SEC)',
            simpleDefinition: 'The government agency that protects investors and enforces fair rules in stock markets.',
            lemonadeAnalogy: 'The city market inspector making sure Chai Haven does not hide bad debts.'
          }
        ]
      },
      {
        heading: '3. Price Band and Book Building',
        body: 'Instead of picking one fixed price, companies usually set a Price Band. A Price Band is a bidding range with a minimum Floor Price and a maximum Cap Price (e.g. $100 to $120). Book Building is the 3-day process of collecting bids from investors to discover the highest fair price the market is willing to pay.',
        inShortRecap: 'In short: The price band is the allowed bidding range; book building is the process of collecting bids.',
        jargonTerms: [
          {
            term: 'Price Band',
            simpleDefinition: 'The minimum and maximum price range within which investors can bid for IPO shares.',
            lemonadeAnalogy: 'Announcing that bids for 1 tea share will be accepted between $100 and $120.'
          },
          {
            term: 'Book Building',
            simpleDefinition: 'The process of recording investor bids to determine the final issue price.',
            lemonadeAnalogy: 'Collecting all written customer bids over 3 days into a ledger to find the sweet spot.'
          },
          {
            term: 'Oversubscribed',
            simpleDefinition: 'When the total demand for shares is greater than the number of shares offered.',
            lemonadeAnalogy: 'Offering 100 tea shares, but eager customers apply for 500 shares (5x oversubscribed).'
          }
        ]
      }
    ],
    quickRecapBullets: [
      'Investment bankers (underwriters) value the business and guide the IPO process.',
      'The DRHP is the official legal booklet detailing all financial data and business risks.',
      'A Price Band gives investors a range (floor to cap) to submit their bids.',
      'Book Building collects all bids during a 3 to 5 day window to determine final market demand.'
    ],
    diagramType: 'ipo_lifecycle',
    quiz: [
      {
        id: 'q3-1',
        question: 'What official document must a company publish disclosing all its financial risks before an IPO?',
        options: [
          { id: 'a', text: 'A social media advertisement', isCorrect: false, explanation: 'An ad does not contain certified financial audits.' },
          { id: 'b', text: 'The Draft Red Herring Prospectus (DRHP)', isCorrect: true, explanation: 'Correct! The DRHP is the formal disclosure booklet reviewed by market regulators.' },
          { id: 'c', text: 'A private email to founders', isCorrect: false, explanation: 'The DRHP must be publicly available to all investors.' }
        ]
      },
      {
        id: 'q3-2',
        question: 'What is a "Price Band" in a book-built IPO?',
        options: [
          { id: 'a', text: 'A musical performance by bankers', isCorrect: false, explanation: 'Price band refers to a financial bidding range.' },
          { id: 'b', text: 'The bidding range between the floor price and cap price', isCorrect: true, explanation: 'Correct! It defines the minimum and maximum price per share for bids.' },
          { id: 'c', text: 'The cost of printing share certificates', isCorrect: false, explanation: 'The price band is the share bidding range.' }
        ]
      },
      {
        id: 'q3-3',
        question: 'What does it mean if an IPO is "5x Oversubscribed"?',
        options: [
          { id: 'a', text: 'Demand is 5 times higher than the available shares', isCorrect: true, explanation: 'Correct! Investors applied for 5 times more shares than the company is selling.' },
          { id: 'b', text: 'The company opened 5 new stores', isCorrect: false, explanation: 'Subscription refers to investor bidding demand.' },
          { id: 'c', text: 'The price of shares dropped 5 times', isCorrect: false, explanation: 'Oversubscription means high demand, not falling prices.' }
        ]
      }
    ]
  },

  // =========================================================================
  // LEVEL 4: THE BIDDING DESK — HOW REGULAR PEOPLE APPLY & GET SHARES
  // =========================================================================
  {
    id: 4,
    levelNumber: 4,
    badge: 'LEVEL 4 • PARTICIPATION',
    title: 'How Regular People Apply and Get Allotted Shares',
    subtitle: 'Demat accounts, lot sizes, ASBA bank freezes, and the allotment lottery.',
    estimatedMinutes: 5,
    runningAnalogyTitle: 'Buying Shares in Chai Haven',
    runningAnalogyText:
      'You loved Chai Haven tea and want to apply for its IPO. You open your phone stock app. You select your lot size and approve a bank hold. If demand is huge, a computerized lottery decides who receives shares.',
    realWorldExampleTitle: 'Real-World Example: Retail Bidding Frenzy',
    realWorldExampleText:
      'During high-profile IPOs, millions of college students and retail investors apply from mobile trading apps. When demand exceeds supply, shares are distributed fairly through a computerized draw.',
    keyConcepts: [
      {
        heading: '1. Demat Account and Lot Size',
        body: 'To hold shares today, you need a Demat Account (Dematerialized Account). A Demat account is an electronic locker that stores your shares digitally. In an IPO, you cannot buy just 1 share. Shares are sold in fixed bundles called Lot Sizes (e.g. 1 lot = 50 shares).',
        inShortRecap: 'In short: A Demat account is your digital share locker; a lot size is the minimum bundle of shares you must buy.',
        jargonTerms: [
          {
            term: 'Demat Account',
            simpleDefinition: 'An electronic account that holds your shares in digital form, like a bank account holds cash.',
            lemonadeAnalogy: 'A secure digital folder holding your electronic lemonade stand share certificates.'
          },
          {
            term: 'Lot Size',
            simpleDefinition: 'The minimum fixed number of shares you must apply for in an IPO.',
            lemonadeAnalogy: 'Tea shares sold in boxes of 50 shares each, rather than loose single shares.'
          }
        ]
      },
      {
        heading: '2. ASBA (Application Supported by Blocked Amount)',
        body: 'In the past, investors mailed cheques and waited weeks for refunds. Today, markets use ASBA. With ASBA, your application money stays in your bank account, but is temporarily blocked (frozen). Money is only deducted if you win shares. If you do not get shares, your money is instantly unblocked.',
        inShortRecap: 'In short: ASBA freezes bid money in your bank account; money is deducted only if you win shares.',
        jargonTerms: [
          {
            term: 'ASBA / UPI Mandate',
            simpleDefinition: 'A secure payment system where application money stays safely blocked in your bank account until allotment.',
            lemonadeAnalogy: 'Putting $500 in a locked clear piggy bank. If you get the tea shares, the lock opens; if not, you keep the piggy bank.'
          }
        ]
      },
      {
        heading: '3. Investor Categories and Allotment Logic',
        body: 'IPO shares are divided into three groups: Retail (everyday citizens bidding small amounts), NII (high-net-worth individuals), and QIB (big institutions like mutual funds and banks). When retail demand is oversubscribed, a computerized lottery picks winning applicants fairly. Every winner gets 1 minimum lot.',
        inShortRecap: 'In short: Shares are reserved for retail and big investors; oversubscribed retail shares are allotted by a fair lottery.',
        jargonTerms: [
          {
            term: 'Retail Individual Investor (RII)',
            simpleDefinition: 'Everyday individual investors who apply for small investment amounts (e.g. under $2,500).',
            lemonadeAnalogy: 'Regular neighborhood tea customers buying 1 or 2 lots.'
          },
          {
            term: 'Allotment',
            simpleDefinition: 'The official distribution and assignment of shares to applicants after the IPO closes.',
            lemonadeAnalogy: 'The final draw that decides which customers receive the tea share certificates.'
          }
        ]
      }
    ],
    quickRecapBullets: [
      'A Demat account is the electronic digital locker required to hold shares.',
      'Shares in an IPO are applied for in fixed bundles called lot sizes.',
      'ASBA keeps your money safely blocked in your own bank account until allotment is decided.',
      'If an IPO is oversubscribed, a computerized lottery distributes shares fairly to applicants.'
    ],
    diagramType: 'bidding_journey',
    quiz: [
      {
        id: 'q4-1',
        question: 'What is the purpose of a Demat account?',
        options: [
          { id: 'a', text: 'To store physical paper files in a bank vault', isCorrect: false, explanation: 'Demat accounts hold electronic shares, replacing paper certificates.' },
          { id: 'b', text: 'To hold shares and securities in digital format', isCorrect: true, explanation: 'Correct! A Demat account holds your shares digitally.' },
          { id: 'c', text: 'To pay for groceries at the store', isCorrect: false, explanation: 'A Demat account is specifically for financial securities.' }
        ]
      },
      {
        id: 'q4-2',
        question: 'How does ASBA protect an investor’s money during an IPO application?',
        options: [
          { id: 'a', text: 'Money stays in your bank account, blocked, until shares are allotted', isCorrect: true, explanation: 'Correct! Funds are never deducted unless you receive an allotment.' },
          { id: 'b', text: 'The company keeps your money forever as a donation', isCorrect: false, explanation: 'Funds are strictly refunded/unblocked if no shares are allotted.' },
          { id: 'c', text: 'You must pay cash in person to the CEO', isCorrect: false, explanation: 'ASBA is a 100% digital bank freeze system.' }
        ]
      },
      {
        id: 'q4-3',
        question: 'If an IPO lot size is 40 shares, can you apply for 15 shares?',
        options: [
          { id: 'a', text: 'Yes, any number is allowed', isCorrect: false, explanation: 'IPO applications must be in multiples of the lot size.' },
          { id: 'b', text: 'No, you must apply in multiples of the lot size (e.g. 40, 80, 120)', isCorrect: true, explanation: 'Correct! You can only bid for full lots (40, 80, etc.).' },
          { id: 'c', text: 'Only on weekends', isCorrect: false, explanation: 'Lot size rules apply at all times.' }
        ]
      }
    ]
  },

  // =========================================================================
  // LEVEL 5: THE OPENING BELL & BEYOND — LISTING GAINS, GMP & RISKS
  // =========================================================================
  {
    id: 5,
    levelNumber: 5,
    badge: 'LEVEL 5 • MARKET MASTERY',
    title: 'The Opening Bell and Beyond: Listing Gains, GMP & Risks',
    subtitle: 'From Day 1 trading pops and grey market premiums to insider lock-in rules.',
    estimatedMinutes: 6,
    runningAnalogyTitle: 'Chai Haven Rings the Bell',
    runningAnalogyText:
      'It is Listing Day. The clock hits 9:15 AM. The ceremonial bell rings. Chai Haven shares, issued at $100, open for trading on the stock exchange at $140. Early allotted investors celebrate a +40% listing gain.',
    realWorldExampleTitle: 'Real-World Example: Listing Pops vs Long-Term Reality',
    realWorldExampleText:
      'Many tech companies experienced massive +50% listing day gains due to heavy excitement, but saw stock prices drop later when quarterly earnings missed expectations. Long-term success depends on real business profits, not Day 1 excitement.',
    keyConcepts: [
      {
        heading: '1. Listing Date and Listing Gains vs. Discount',
        body: 'The Listing Date is the official day shares start trading publicly on the stock exchange. If a stock issued at $100 opens at $140, investors earn a Listing Gain of +40%. If poor market mood causes it to open at $85, it is called a Listing Discount.',
        inShortRecap: 'In short: Listing day is when public trading starts; listing gain is the Day 1 price jump above the issue price.',
        jargonTerms: [
          {
            term: 'Listing Date',
            simpleDefinition: 'The official first day a company’s shares start trading openly on a stock exchange.',
            lemonadeAnalogy: 'The grand opening day when Chai Haven shares appear on the public market board.'
          },
          {
            term: 'Listing Gain',
            simpleDefinition: 'The profit made when the stock opens at a higher price on Day 1 than the IPO issue price.',
            lemonadeAnalogy: 'Buying a tea share for $100 in the IPO and seeing it trade at $140 on Day 1.'
          }
        ]
      },
      {
        heading: '2. Grey Market Premium (GMP)',
        body: 'Before the official listing day, people unofficially trade opinions on what the stock might open at. This unofficial sentiment indicator is called the Grey Market Premium (GMP). If a $100 share has a GMP of $30, people expect it to open near $130. However, the grey market is unofficial and unregulated; investors should always study real business financials instead of relying on GMP.',
        inShortRecap: 'In short: GMP is an unofficial sentiment guess of Day 1 price gains, but it carries no legal guarantees.',
        jargonTerms: [
          {
            term: 'Grey Market Premium (GMP)',
            simpleDefinition: 'An unofficial, unregulated estimate of how much above the issue price a stock might list.',
            lemonadeAnalogy: 'Neighbours chatting on the street guessing how high tea shares will trade on opening day.'
          }
        ]
      },
      {
        heading: '3. Insider Lock-in Periods and Long-Term Fundamentals',
        body: 'To protect the public from founders dumping all their shares on Day 1, regulators enforce a Lock-in Period. A Lock-in Period is a mandatory time (e.g. 30–90 days for big funds, 18 months for founders) during which insiders are legally forbidden from selling their shares. After listing day, hype fades and the stock price is determined by real quarterly sales and business profits.',
        inShortRecap: 'In short: Lock-in periods prevent insiders from dumping shares; long-term stock prices depend on real company profits.',
        jargonTerms: [
          {
            term: 'Lock-in Period',
            simpleDefinition: 'A mandatory holding period during which company promoters and anchor investors cannot sell their shares.',
            lemonadeAnalogy: 'Rahul agreeing not to sell his founder shares for 18 months so customers know he is committed.'
          },
          {
            term: 'Anchor Investor',
            simpleDefinition: 'Large institutional investors (mutual funds, banks) who buy large blocks of shares before the public IPO.',
            lemonadeAnalogy: 'A major food company buying 10% of Chai Haven before the public bidding starts.'
          }
        ]
      }
    ],
    quickRecapBullets: [
      'The Listing Date marks the official start of open public trading on a stock exchange.',
      'A Listing Gain occurs when the opening price is higher than the IPO issue price.',
      'Grey Market Premium (GMP) is an unofficial sentiment guess, not an official guarantee.',
      'Regulators enforce insider lock-in periods to prevent founders and large funds from selling off immediately.'
    ],
    diagramType: 'listing_day_matrix',
    quiz: [
      {
        id: 'q5-1',
        question: 'What is a "Listing Gain"?',
        options: [
          { id: 'a', text: 'The price jump on the first day of trading above the IPO issue price', isCorrect: true, explanation: 'Correct! Listing gain is the profit earned when the stock opens higher on Day 1.' },
          { id: 'b', text: 'A discount coupon for store drinks', isCorrect: false, explanation: 'Listing gain is a financial stock return.' },
          { id: 'c', text: 'A fine charged by the government', isCorrect: false, explanation: 'Listing gain is profit for allotted investors.' }
        ]
      },
      {
        id: 'q5-2',
        question: 'Why do market regulators enforce a "Lock-in Period" on company founders and anchor investors?',
        options: [
          { id: 'a', text: 'To prevent insiders from immediately dumping all their shares on the public', isCorrect: true, explanation: 'Correct! Lock-in rules ensure founders stay committed to the company.' },
          { id: 'b', text: 'To shut down the stock exchange on weekends', isCorrect: false, explanation: 'Lock-in periods apply specifically to insider share sales.' },
          { id: 'c', text: 'Because founders are not allowed to own shares', isCorrect: false, explanation: 'Founders own shares, but must hold them for a minimum duration.' }
        ]
      },
      {
        id: 'q5-3',
        question: 'Why should a long-term investor study business fundamentals rather than relying solely on Grey Market Premium (GMP)?',
        options: [
          { id: 'a', text: 'GMP is an unofficial guess, while long-term stock prices depend on real company profits', isCorrect: true, explanation: 'Correct! Real revenue and profits drive sustainable long-term stock value.' },
          { id: 'b', text: 'GMP is legally binding in court', isCorrect: false, explanation: 'The grey market is completely unofficial and unregulated.' },
          { id: 'c', text: 'Companies are shut down after listing day', isCorrect: false, explanation: 'Companies continue operating for decades after an IPO.' }
        ]
      }
    ]
  }
];
