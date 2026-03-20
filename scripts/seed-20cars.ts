import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = path.join(process.cwd(), 'data', 'cfo.db')
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Init schema (in case tables don't exist)
db.exec(`
  CREATE TABLE IF NOT EXISTS cars (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    shortName TEXT NOT NULL,
    year INTEGER NOT NULL,
    price INTEGER NOT NULL,
    mileage INTEGER NOT NULL,
    color TEXT NOT NULL,
    colorHex TEXT NOT NULL,
    emoji TEXT NOT NULL,
    engine TEXT NOT NULL,
    power TEXT NOT NULL,
    torque TEXT NOT NULL,
    gearbox TEXT NOT NULL,
    accel TEXT NOT NULL,
    topSpeed TEXT NOT NULL,
    vin TEXT NOT NULL,
    dealScore REAL NOT NULL,
    verdict TEXT NOT NULL,
    annualCost INTEGER NOT NULL,
    priceVsMarket REAL NOT NULL,
    depreciationYear INTEGER NOT NULL,
    motStatus TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS faults (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carId TEXT NOT NULL REFERENCES cars(id),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS mot_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carId TEXT NOT NULL REFERENCES cars(id),
    date TEXT NOT NULL,
    result TEXT NOT NULL,
    mileage INTEGER,
    notes TEXT
  );
  CREATE TABLE IF NOT EXISTS price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carId TEXT NOT NULL REFERENCES cars(id),
    date TEXT NOT NULL,
    price INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS mileage_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carId TEXT NOT NULL REFERENCES cars(id),
    date TEXT NOT NULL,
    mileage INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS extras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carId TEXT NOT NULL REFERENCES cars(id),
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    fitted INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS specs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carId TEXT NOT NULL REFERENCES cars(id),
    label TEXT NOT NULL,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS costs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carId TEXT NOT NULL REFERENCES cars(id),
    label TEXT NOT NULL,
    value INTEGER NOT NULL,
    color TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS communities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carId TEXT NOT NULL REFERENCES cars(id),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    icon TEXT NOT NULL,
    url TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS service_schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carId TEXT NOT NULL REFERENCES cars(id),
    item TEXT NOT NULL,
    interval TEXT NOT NULL,
    nextDue TEXT NOT NULL,
    urgent INTEGER NOT NULL DEFAULT 0
  );
`)

const insertCar = db.prepare(`INSERT OR IGNORE INTO cars VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
const insertFault = db.prepare(`INSERT INTO faults (carId,name,description,severity) VALUES (?,?,?,?)`)
const insertMot = db.prepare(`INSERT INTO mot_history (carId,date,result,mileage,notes) VALUES (?,?,?,?,?)`)
const insertPrice = db.prepare(`INSERT INTO price_history (carId,date,price) VALUES (?,?,?)`)
const insertMileage = db.prepare(`INSERT INTO mileage_history (carId,date,mileage) VALUES (?,?,?)`)
const insertExtra = db.prepare(`INSERT INTO extras (carId,name,price,fitted) VALUES (?,?,?,?)`)
const insertSpec = db.prepare(`INSERT INTO specs (carId,label,value) VALUES (?,?,?)`)
const insertCost = db.prepare(`INSERT INTO costs (carId,label,value,color) VALUES (?,?,?,?)`)
const insertCommunity = db.prepare(`INSERT INTO communities (carId,name,type,icon,url) VALUES (?,?,?,?,?)`)
const insertService = db.prepare(`INSERT INTO service_schedule (carId,item,interval,nextDue,urgent) VALUES (?,?,?,?,?)`)

// Helper to check if car already exists
const carExists = db.prepare(`SELECT id FROM cars WHERE id = ?`)

const seedNewCars = db.transaction(() => {

  // =====================
  // 1. Volkswagen Golf R (Mk8)
  // Market: £17k-£32.8k, avg £24,500, 184 listings
  // =====================
  if (!carExists.get('volkswagen-golf-r')) {
    insertCar.run('volkswagen-golf-r','Volkswagen Golf R (Mk8)','VW Golf R Mk8',2022,24950,52000,
      'Deep Black Pearl','#0d0d0d','⚫',
      '2.0 TSI 320hp 4Motion','320hp','310lb-ft','7-speed DSG','4.7s','155mph',
      'WVWZZZAUZNW123456',7.4,
      "Solid value buy — 2022 plate at £24,950 with 52k miles sits right in the sweet spot of the market. The Golf R is the thinking person's hot hatch: subtle looks, serious performance, practical hatchback. Main watch-out is the Mk8 infotainment system which is universally disliked (touch-sensitive controls, laggy software). Common DSG software issues have largely been resolved via OTA updates by now. Verify the DSG fluid has been changed — often neglected. 4Motion AWD makes this grippy in all conditions. Good buy with room to negotiate £500-1,000.",
      6280,-0.2,2500,'Clean')

    for (const [n,d,s] of [
      ['DSG Gearbox Shudder','Cold-start shudder and hesitation on the 7-speed wet-clutch DSG. Usually resolves once warm. Persistent cases need fluid change or adaptation reset.','medium'],
      ['Mk8 Infotainment Glitches','The touch-sensitive controls and capacitive buttons are widely criticised. Software freezes, volume knob unresponsive. Updates help but fundamental design flaw.','medium'],
      ['Oil Consumption','EA888 engines can consume oil, especially when pushed hard. Check level between oil changes. More concerning if over 1L per 5k miles.','medium'],
      ['Front Diff Under Hard Cornering','Torque vectoring front diff can clunk or bind under very hard cornering. Software-related in most cases. Check for updates.','low'],
      ['Carbon Buildup','Direct injection means no fuel wash of intake valves. Walnut blast recommended at 30-40k miles. Slight rough idle or hesitation.','medium'],
      ['AC Compressor Failures','Early Mk8 batch had AC compressor failures. Check cold air is blowing properly. Replacement £600-900.','medium'],
      ['Brake Fluid Degradation','DSG/performance use accelerates brake fluid moisture absorption. Annual change recommended for spirited drivers.','low'],
    ] as [string,string,string][]) insertFault.run('volkswagen-golf-r', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Feb 2025','PASS',52000,'Clean pass — no advisories'],
      ['Feb 2024','PASS',39200,'Clean pass — tyre tread noted as near limit'],
      ['Feb 2023','PASS',26100,'First MOT — clean pass'],
    ]) insertMot.run('volkswagen-golf-r', d, r, mi, notes)

    for (const [d,p] of [['Mar 22',43500],['Sep 22',40000],['Mar 23',36500],['Sep 23',32000],['Mar 24',28500],['Sep 24',26500],['Mar 25',24500]])
      insertPrice.run('volkswagen-golf-r', d, p)

    for (const [d,mi] of [['Mar 22',0],['Feb 23',13000],['Feb 24',26100],['Feb 25',52000]])
      insertMileage.run('volkswagen-golf-r', d, mi)

    for (const [n,p,f] of [
      ['Akrapovič Exhaust System',2800,0],['Panoramic Sunroof',1100,1],['Harman Kardon Sound',650,1],
      ['Head-Up Display',900,1],['Heated Front Seats',450,1],['19" Pretoria Alloys',0,1],
      ['Keyless Entry & Start',450,1],
    ]) insertExtra.run('volkswagen-golf-r', n, p, f)

    for (const [l,v] of [
      ['Make','Volkswagen'],['Model','Golf R'],['Generation','Mk8'],['Engine Code','EA888 EVO4'],
      ['Displacement','1,984cc'],['Cylinders','Inline-4 Turbo'],['Power','320hp @ 5,450rpm'],
      ['Torque','310lb-ft @ 2,100rpm'],['Gearbox','7-speed DSG wet-clutch'],['Drive','4Motion AWD'],
      ['Kerb Weight','1,554kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','155 g/km'],['Body','5-door Hatchback'],
    ]) insertSpec.run('volkswagen-golf-r', l, v)

    for (const [l,v,c] of [
      ['Insurance',1500,'#3b82f6'],['Road Tax',185,'#8b5cf6'],['Fuel',2400,'#f59e0b'],
      ['Servicing',500,'#10b981'],['Tyres',700,'#ef4444'],
    ]) insertCost.run('volkswagen-golf-r', l, v, c)

    for (const [n,t,ic,u] of [
      ['VWVortex Golf R','Global Forum','💬','https://vwvortex.com'],
      ['Golf R Owners Club UK','UK Club','🏴','https://golfrownersclub.co.uk'],
      ['r/GolfR','Reddit','🤖','https://reddit.com/r/GolfR'],
      ['ClubGolf.co.uk','UK Forum','🗣️','https://clubgolf.co.uk'],
      ['TyreReviews Golf R','Reviews','⭐','https://tyrereviews.com'],
    ]) insertCommunity.run('volkswagen-golf-r', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','10,000 mi / 12 months','Due at 60,000 mi (8,000 mi away)',0],
      ['Brake Fluid','2 years','Due Feb 2027',0],
      ['DSG Fluid & Filter','40,000 mi','Due now — at 52,000 mi (OVERDUE)',1],
      ['Spark Plugs','40,000 mi','Due now — at 52,000 mi (OVERDUE)',1],
      ['Air Filter','30,000 mi','Due now — OVERDUE',1],
      ['Pollen Filter','2 years','Due Feb 2027',0],
    ]) insertService.run('volkswagen-golf-r', item, intv, next, urg)
  }

  // =====================
  // 2. Honda Civic Type R (FL5)
  // Market: £37.5k-£43.5k, avg £40,800, only 17 listings
  // =====================
  if (!carExists.get('honda-civic-type-r')) {
    insertCar.run('honda-civic-type-r','Honda Civic Type R (FL5)','Honda CTR FL5',2023,39945,15000,
      'Championship White','#f8f8f8','⬜',
      '2.0 VTEC Turbo 329hp','329hp','310lb-ft','6-speed Manual FWD','5.4s','169mph',
      'SHHFK3370PU100456',8.6,
      "Exceptional buy — only 17 FL5s on AutoTrader nationwide. This is genuinely rare. Full Honda main dealer service history, 15k miles, one owner. The FL5 is objectively the best FWD hot hatch ever made — Nürburgring record holder. 329hp through the front wheels sounds alarming but Honda's torque-vectoring steering makes it an engineering marvel. Manual-only, no automatic option exists, which maintains values. Championship White with red accents is the hero spec. At £39,945 you are slightly below market average — that's value in a market with no supply. Buy it before someone else does.",
      5980,2.4,2500,'Clean')

    for (const [n,d,s] of [
      ['Torque Steer Under Power','329hp FWD means torque steer under full acceleration. Less than rivals but noticeable. Honda torque-vectoring helps but never fully eliminates.','low'],
      ['Brake Fade on Track','Stock Brembo brakes fade after sustained track use. Track day drivers should budget for pads & fluid change. Road use is fine.','medium'],
      ['Infotainment Laggy','Honda 9-inch touchscreen is sluggish. CarPlay/Android Auto helps. Not a reliability concern, just annoying.','low'],
      ['Road Noise on Motorways','Wider Michelin PS4S tyres create noticeable road noise at motorway speeds. A trade-off for the performance grip.','low'],
      ['Service Interval Awareness','Requires 0W-20 specific oil grade. Using wrong oil grade can cause engine damage. Always verify oil spec at service.','medium'],
      ['Clutch Wear','Spirited driving and launch control use accelerates clutch wear. Check pedal feel and engagement point. Replacement ~£900-1,200.','medium'],
    ] as [string,string,string][]) insertFault.run('honda-civic-type-r', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Jan 2025','PASS',15000,'Clean pass — no advisories'],
    ]) insertMot.run('honda-civic-type-r', d, r, mi, notes)

    for (const [d,p] of [['Sep 22',44995],['Mar 23',44000],['Sep 23',43000],['Mar 24',41500],['Sep 24',40500],['Mar 25',39500]])
      insertPrice.run('honda-civic-type-r', d, p)

    for (const [d,mi] of [['Sep 22',0],['Jan 25',15000]])
      insertMileage.run('honda-civic-type-r', d, mi)

    for (const [n,p,f] of [
      ['Mugen Rear Spoiler',950,0],['Mugen Front Splitter',650,0],['Akrapovič Exhaust',2400,0],
      ['Type R Floor Mats',180,1],['Genuine Honda Dash Cam',350,1],['Honda Sensing Safety Pack',0,1],
      ['Wireless CarPlay',0,1],
    ]) insertExtra.run('honda-civic-type-r', n, p, f)

    for (const [l,v] of [
      ['Make','Honda'],['Model','Civic Type R'],['Generation','FL5'],['Engine Code','K20C1'],
      ['Displacement','1,995cc'],['Cylinders','Inline-4 VTEC Turbo'],['Power','329hp @ 6,500rpm'],
      ['Torque','310lb-ft @ 2,600rpm'],['Gearbox','6-speed Manual'],['Drive','FWD + Torque Vectoring Steering'],
      ['Kerb Weight','1,434kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','182 g/km'],['Body','5-door Hatchback'],
    ]) insertSpec.run('honda-civic-type-r', l, v)

    for (const [l,v,c] of [
      ['Insurance',1800,'#3b82f6'],['Road Tax',280,'#8b5cf6'],['Fuel',2600,'#f59e0b'],
      ['Servicing',450,'#10b981'],['Tyres',800,'#ef4444'],
    ]) insertCost.run('honda-civic-type-r', l, v, c)

    for (const [n,t,ic,u] of [
      ['CivicX Type R','Global Forum','💬','https://civicxi.com'],
      ['CTR UK Community','UK Owners','🏴','#'],
      ['r/hondacivic','Reddit','🤖','https://reddit.com/r/hondacivic'],
      ['Type R Owners Club','UK Club','🏆','#'],
      ['Nürburgring FWD Record','History','🏎️','https://en.wikipedia.org/wiki/Nurburgring'],
    ]) insertCommunity.run('honda-civic-type-r', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','5,000 mi / 12 months (Honda Maintenance Minder)','Due at 20,000 mi (5,000 mi away)',0],
      ['Brake Fluid','2 years','Due Sep 2024 — OVERDUE',1],
      ['Spark Plugs','30,000 mi','Due at 30,000 mi',0],
      ['Clutch Inspection','15,000 mi','Check at next service — due now',1],
      ['Air Filter','30,000 mi','Due at 30,000 mi',0],
      ['Coolant','5 years','Due Sep 2027',0],
    ]) insertService.run('honda-civic-type-r', item, intv, next, urg)
  }

  // =====================
  // 3. Toyota GR Yaris
  // Market: £22k-£41k, avg £30,500, 26 listings
  // =====================
  if (!carExists.get('toyota-gr-yaris')) {
    insertCar.run('toyota-gr-yaris','Toyota GR Yaris (GXPA16)','Toyota GR Yaris',2021,27295,19001,
      'Scarlet Flare Red','#cc2200','🔴',
      '1.6 G16E-GTS Turbo 261hp GR Four','261hp','266lb-ft','6-speed Manual AWD','5.5s','143mph',
      'SB1P35UE3MU001234',8.3,
      "Hidden gem — only 26 GR Yaris on AutoTrader nationwide. Built in tiny numbers (track homologation special), this is the real deal rally car for the road. The engine is pure motorsport DNA — wins every engineering award. 19k miles on a 2021 is healthy. Red exterior matches the car's character. Values are rising on clean examples. One key check: verify the rear differential hasn't been modified or over-stressed (trackday records). The standard Sport mode and Track mode are transformative. This is a future classic.",
      5380,0.8,2000,'Clean')

    for (const [n,d,s] of [
      ['Rear Diff Overheating','Under sustained hard cornering or track use, the rear diff can overheat triggering a limiter. Aftermarket cooling solutions exist. Check for any evidence of track use.','high'],
      ['Clutch Wear (Aggressive Use)','The 6-speed manual is excellent but the compact clutch can wear quickly with spirited driving. Check bite point. Replacement ~£800-1,100.','medium'],
      ['Gear Selection Resistance','Some owners report increased gear-change resistance as gearbox warms up. Associated with ATF (automatic transmission fluid) quality. Fluid change recommended.','medium'],
      ['Engine Oil Consumption','Small turbocharged engine can consume oil under hard use. Check level frequently. Above 500ml between services = investigate.','medium'],
      ['Suspension Clunking','Stiff suspension setup (designed for WRC) creates clunks over potholes and speed bumps on road use. Largely normal. Worn bushings amplify this.','low'],
      ['Window Defrost Wires','Fragile rear window element wires can break from pressure cleaning. Use cloth only. Replacement screen £400+.','low'],
    ] as [string,string,string][]) insertFault.run('toyota-gr-yaris', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Sep 2024','PASS',19001,'Clean pass'],
      ['Sep 2023','PASS',10800,'Clean pass — minor suspension advisory'],
    ]) insertMot.run('toyota-gr-yaris', d, r, mi, notes)

    for (const [d,p] of [['Sep 21',32500],['Mar 22',33000],['Sep 22',32000],['Mar 23',30500],['Sep 23',29000],['Mar 24',28000],['Sep 24',27000]])
      insertPrice.run('toyota-gr-yaris', d, p)

    for (const [d,mi] of [['Sep 21',0],['Sep 23',10800],['Sep 24',19001]])
      insertMileage.run('toyota-gr-yaris', d, mi)

    for (const [n,p,f] of [
      ['Circuit Pack (Torsen LSD + forged wheels)',4500,0],['TRD Rear Diff Cooler',850,0],
      ['TRD Front Strut Brace',420,1],['Toyota Safety Sense',0,1],['Heated Seats',400,1],
      ['TRD Sports Floor Mats',180,1],['GR Yaris Trackday Kit',0,0],
    ]) insertExtra.run('toyota-gr-yaris', n, p, f)

    for (const [l,v] of [
      ['Make','Toyota'],['Model','GR Yaris'],['Generation','GXPA16'],['Engine Code','G16E-GTS'],
      ['Displacement','1,618cc'],['Cylinders','Inline-3 Turbo'],['Power','261hp @ 6,500rpm'],
      ['Torque','266lb-ft @ 3,000rpm'],['Gearbox','6-speed iMT'],['Drive','GR-FOUR AWD (50/50 centre split)'],
      ['Kerb Weight','1,280kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','183 g/km'],['Body','3-door Hatchback (WRC homologation)'],
    ]) insertSpec.run('toyota-gr-yaris', l, v)

    for (const [l,v,c] of [
      ['Insurance',1600,'#3b82f6'],['Road Tax',280,'#8b5cf6'],['Fuel',2200,'#f59e0b'],
      ['Servicing',450,'#10b981'],['Tyres',700,'#ef4444'],
    ]) insertCost.run('toyota-gr-yaris', l, v, c)

    for (const [n,t,ic,u] of [
      ['GR Yaris Forum','Global','💬','https://gryaris.net'],
      ['GR Owners UK','UK Club','🏴','#'],
      ['r/GRYaris','Reddit','🤖','https://reddit.com/r/GRYaris'],
      ['TRD UK','Official Accessories','🏎️','https://toyota.co.uk/trd'],
      ['Toyota Gazoo Racing','Official','⭐','https://gazooracing.com'],
    ]) insertCommunity.run('toyota-gr-yaris', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','5,000 mi / 12 months','Due at 25,000 mi (6,000 mi away)',0],
      ['Brake Fluid','2 years','Due Sep 2025',0],
      ['Front & Rear Diff Fluid','15,000 mi','Due now — OVERDUE',1],
      ['Transfer Coupling Fluid','15,000 mi','Due now — OVERDUE',1],
      ['Spark Plugs','20,000 mi','Due at 20,000 mi (1,000 mi away)',1],
      ['Coolant','5 years','Due Sep 2026',0],
    ]) insertService.run('toyota-gr-yaris', item, intv, next, urg)
  }

  // =====================
  // 4. Hyundai i30 N
  // Market: £15.5k-£28k, avg £21,000, 85 listings
  // =====================
  if (!carExists.get('hyundai-i30n')) {
    insertCar.run('hyundai-i30n','Hyundai i30 N Performance','Hyundai i30 N',2022,22000,25000,
      'Performance Blue','#003399','🔵',
      '2.0 T-GDi 280hp','280hp','289lb-ft','6-speed Manual FWD','5.4s','155mph',
      'TMAH3813MNJ112345',7.8,
      "Outstanding value — the i30 N is the best budget hot hatch in this watchlist. 280hp through the front wheels with an electronic LSD, rev-matching, launch control, and N Grin Control for £22k on a 2022 plate is genuinely remarkable. Hyundai reliability from the factory, plus the 5-year warranty may still have coverage remaining. 25k miles is low for age. Compare this to the Golf R at £24,950 — the i30 N is faster in a straight line, cheaper to run, and the warranty alone is worth thousands. The stigma is diminishing fast. Buy with confidence.",
      5580,0.5,2000,'Clean')

    for (const [n,d,s] of [
      ['Electronic LSD Noise','The e-LSD can produce clunking or clicking under power on tight corners. Normal behaviour but some owners are alarmed. Check software version.','low'],
      ['Infotainment Screen Glare','10.25" screen has significant glare in direct sunlight. Not a reliability issue but a usability complaint.','low'],
      ['Front Wishbone Wear','Performance driving accelerates wishbone bushing wear. Clunking over bumps indicates replacement needed. Dealer warranty covers this.','medium'],
      ['Engine Mount Vibration','Sporty engine mounts transmit vibration at idle. Part of the character but may annoy some. Can be addressed with uprated mounts.','low'],
      ['Turbo Boost Solenoid','Occasional boost pressure faults on high-mileage examples. Check for any fault codes. Solenoid replacement ~£200.','medium'],
      ['Clutch Pedal Heaviness','Standard clutch has heavy pedal feel — tiring in traffic. Part of design but worth testing on a long drive.','low'],
    ] as [string,string,string][]) insertFault.run('hyundai-i30n', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Mar 2025','PASS',25000,'Clean pass'],
      ['Mar 2024','PASS',13500,'Clean pass'],
    ]) insertMot.run('hyundai-i30n', d, r, mi, notes)

    for (const [d,p] of [['Mar 22',32000],['Sep 22',30000],['Mar 23',27500],['Sep 23',25500],['Mar 24',24000],['Sep 24',23000],['Mar 25',22000]])
      insertPrice.run('hyundai-i30n', d, p)

    for (const [d,mi] of [['Mar 22',0],['Mar 24',13500],['Mar 25',25000]])
      insertMileage.run('hyundai-i30n', d, mi)

    for (const [n,p,f] of [
      ['Performance Pack (e-LSD + Launch Control)',1500,1],['N Light Sport Bucket Seats',2200,0],
      ['Panoramic Sunroof',850,0],['Bose Premium Sound',450,1],['Heated Front Seats',400,1],
      ['Wireless CarPlay',0,1],['N Titanium Exhaust',1200,0],
    ]) insertExtra.run('hyundai-i30n', n, p, f)

    for (const [l,v] of [
      ['Make','Hyundai'],['Model','i30 N Performance'],['Generation','2022 facelift'],['Engine Code','G4KH'],
      ['Displacement','1,998cc'],['Cylinders','Inline-4 T-GDi'],['Power','280hp @ 6,000rpm'],
      ['Torque','289lb-ft @ 2,100rpm'],['Gearbox','6-speed Manual'],['Drive','FWD + e-LSD'],
      ['Kerb Weight','1,478kg'],['Fuel','Super Unleaded (95 RON minimum)'],['CO2','198 g/km'],['Body','5-door Hatchback'],
    ]) insertSpec.run('hyundai-i30n', l, v)

    for (const [l,v,c] of [
      ['Insurance',1400,'#3b82f6'],['Road Tax',330,'#8b5cf6'],['Fuel',2200,'#f59e0b'],
      ['Servicing',400,'#10b981'],['Tyres',650,'#ef4444'],
    ]) insertCost.run('hyundai-i30n', l, v, c)

    for (const [n,t,ic,u] of [
      ['i30 N Forum UK','UK Community','💬','#'],
      ['Hyundai N Owners','Global','🌍','#'],
      ['r/Hyundai','Reddit','🤖','https://reddit.com/r/Hyundai'],
      ['N Performance','Official','⭐','https://hyundai.com/uk'],
      ['PistonHeads i30N','Reviews','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('hyundai-i30n', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','10,000 mi / 12 months','Due at 30,000 mi (5,000 mi away)',0],
      ['Brake Fluid','2 years','Due Mar 2026',0],
      ['e-LSD & Gearbox Fluid','30,000 mi','Due at 30,000 mi',0],
      ['Spark Plugs','30,000 mi','Due at 30,000 mi',0],
      ['Air Filter','20,000 mi','Due now — OVERDUE',1],
      ['Coolant','5 years','Due Mar 2027',0],
    ]) insertService.run('hyundai-i30n', item, intv, next, urg)
  }

  // =====================
  // 5. Mercedes-AMG A45 S
  // Market: £27k-£47.5k, avg £33,000, 97 listings
  // =====================
  if (!carExists.get('mercedes-amg-a45s')) {
    insertCar.run('mercedes-amg-a45s','Mercedes-AMG A45 S 4MATIC+','Mercedes A45 S',2021,31500,48000,
      'Cosmos Black Metallic','#1a1a2e','⚫',
      '2.0 AMG Turbo 421hp M139','421hp','369lb-ft','8-speed AMG DCT 4MATIC+','3.9s','168mph',
      'WDD1770872V123456',7.2,
      "High risk, high reward — the A45 S has the most powerful 2.0L engine in production (421hp). Absolutely deranged performance. However, the M139 engine and AMG DCT gearbox have known issues that make this a car for mechanically-brave buyers. At 48k miles on a 2021 plate, it is been driven. The M139 engine is rev-hungry and can suffer valve train issues. Critical: get the TCU software version checked — AMG released a critical gearbox update. Budget for potential gearbox work. If everything checks out, this is a genuine supercar slayer at hot hatch money.",
      7480,0.2,3000,'Clean')

    for (const [n,d,s] of [
      ['M139 Valve Train Issues','High-revving 2.0T can develop timing chain and valve train noise. Early signs: ticking on startup. Progressive issue that can lead to engine damage if ignored.','critical'],
      ['DCT Gearbox TCU Software','CRITICAL: Multiple TCU software versions with known bugs causing erratic shifts, overheating warnings. Check current software version with AMG dealer immediately.','critical'],
      ['Gearbox Overheating','AMG DCT generates significant heat. Extended slow traffic or spirited driving triggers overheating limiter. Poor gearbox cooling design.','high'],
      ['Engine Mount Deterioration','Firm AMG mounts degrade faster than standard. Vibration increases significantly when worn. Replacement every 30-40k miles expected.','high'],
      ['Brake Caliper Sticking','AMG performance calipers can stick, especially on cars that are driven hard then parked. Uneven pad wear. Rebuild kit or replacement needed.','medium'],
      ['Infotainment (MBUX) Glitches','MBUX can be laggy, require reboots, lose CarPlay connection. Software updates available. Generally improving over time.','low'],
      ['Injector Seal Failures','Carbon buildup on direct injection combined with high pressure can lead to injector seal weeping. Check for fuel smell near engine bay.','medium'],
    ] as [string,string,string][]) insertFault.run('mercedes-amg-a45s', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Apr 2025','PASS',48000,'Clean pass — advisory on engine mount'],
      ['Apr 2024','PASS',34000,'Clean pass'],
      ['Apr 2023','PASS',19500,'Clean pass'],
    ]) insertMot.run('mercedes-amg-a45s', d, r, mi, notes)

    for (const [d,p] of [['Sep 21',55000],['Mar 22',53000],['Sep 22',48000],['Mar 23',44000],['Sep 23',39000],['Mar 24',35000],['Sep 24',32000]])
      insertPrice.run('mercedes-amg-a45s', d, p)

    for (const [d,mi] of [['Sep 21',0],['Apr 23',19500],['Apr 24',34000],['Apr 25',48000]])
      insertMileage.run('mercedes-amg-a45s', d, mi)

    for (const [n,p,f] of [
      ['AMG Aerodynamics Package',2200,1],['AMG Performance Exhaust',2800,1],
      ['AMG Track Pace App',500,1],['Burmester Sound System',1200,0],
      ['AMG Performance Seats',2400,1],['Head-Up Display',1000,1],
      ['AMG Night Package',750,1],
    ]) insertExtra.run('mercedes-amg-a45s', n, p, f)

    for (const [l,v] of [
      ['Make','Mercedes-AMG'],['Model','A45 S 4MATIC+'],['Generation','W177'],['Engine Code','M139'],
      ['Displacement','1,991cc'],['Cylinders','Inline-4 Twin-Scroll Turbo'],['Power','421hp @ 6,750rpm'],
      ['Torque','369lb-ft @ 5,000rpm'],['Gearbox','8-speed AMG Speedshift DCT'],['Drive','4MATIC+ AWD'],
      ['Kerb Weight','1,605kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','173 g/km'],['Body','5-door Hatchback'],
    ]) insertSpec.run('mercedes-amg-a45s', l, v)

    for (const [l,v,c] of [
      ['Insurance',2000,'#3b82f6'],['Road Tax',280,'#8b5cf6'],['Fuel',2800,'#f59e0b'],
      ['Servicing',800,'#10b981'],['Tyres',900,'#ef4444'],
    ]) insertCost.run('mercedes-amg-a45s', l, v, c)

    for (const [n,t,ic,u] of [
      ['MBWorld A45 AMG','Global Forum','💬','https://mbworld.org'],
      ['AMG Owners Club UK','Official','🏆','https://amgownersclub.co.uk'],
      ['r/AMG','Reddit','🤖','https://reddit.com/r/AMG'],
      ['A45 AMG Forum UK','UK Specialist','🏴','#'],
      ['PistonHeads A45S','Reviews','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('mercedes-amg-a45s', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','10,000 mi / 12 months','Due at 50,000 mi (2,000 mi away)',1],
      ['Brake Fluid','2 years','Due Apr 2025 — OVERDUE',1],
      ['DCT Fluid','30,000 mi','Due now — OVERDUE at 48,000 mi',1],
      ['Spark Plugs','30,000 mi','Due now — OVERDUE',1],
      ['Engine Mount Inspection','30,000 mi','Inspect now — advisory at MOT',1],
      ['TCU Software Check','Annually','Check immediately with AMG dealer',1],
    ]) insertService.run('mercedes-amg-a45s', item, intv, next, urg)
  }

  // =====================
  // 6. Toyota GR Supra (A90)
  // Market: £28k-£36k, avg £34,000, 30 listings
  // =====================
  if (!carExists.get('toyota-gr-supra')) {
    insertCar.run('toyota-gr-supra','Toyota GR Supra 3.0 A90','Toyota GR Supra',2021,34010,30400,
      'Phantom Mat Grey','#555555','⬛',
      'BMW B58 3.0L Turbo I6 382hp','382hp','368lb-ft','8-speed ZF auto RWD','4.3s','155mph',
      'SB1JA3AE3MK012345',7.6,
      "Good deal — the 2021+ 3.0 Supra with 382hp is the one to buy, not the 2.0T. The B58 engine is essentially the same unit as in the BMW Z4 M40i — bulletproof reliability with enormous tuning potential. 30k miles on a 2021 is reasonable. Phantom Grey is a premium colour. The car shares too much BMW DNA for Toyota purists but that's your gain as a buyer — BMW parts availability and reliability. Check for modifications (extremely popular with tuners). A stock, well-maintained example is now below the depreciation cliff. The Supra badge carries strong emotional value.",
      6280,-0.3,2800,'Clean')

    for (const [n,d,s] of [
      ['Stiff Ride Quality','Suspension is firm for a GT car. Small bumps feel sharp. Compared to the BMW Z4 sibling, the Supra is noticeably firmer.','low'],
      ['Limited Boot Space','174L boot is tiny. Not a practical car. Half the width of the rear is taken up by mechanics. No manual option originally.','low'],
      ['B58 Turbo Oil Leak','Small oil seep from turbo-related gaskets is a known B58 issue. Monitor for oil smell and check under the car. Usually minor.','medium'],
      ['Differential Whine','Open rear diff can whine under load, especially when cornering hard. Electronic limited-slip diff helps but rear end can be wayward.','medium'],
      ['Interior Shared with BMW','Interior switchgear and iDrive system are pure BMW. Some Toyota buyers are disappointed. Good news: BMW quality and reliability.','low'],
      ['Catalytic Converter Theft Risk','Like many sporty cars, catalytic converters are a theft target. Fit a Catloc or similar. Insurance claim £2,000+.','medium'],
    ] as [string,string,string][]) insertFault.run('toyota-gr-supra', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Mar 2025','PASS',30400,'Clean pass'],
      ['Mar 2024','PASS',20100,'Clean pass'],
      ['Mar 2023','PASS',10500,'First MOT — clean pass'],
    ]) insertMot.run('toyota-gr-supra', d, r, mi, notes)

    for (const [d,p] of [['Mar 21',53000],['Sep 21',51000],['Mar 22',49000],['Sep 22',45000],['Mar 23',41000],['Sep 23',37000],['Mar 24',35000]])
      insertPrice.run('toyota-gr-supra', d, p)

    for (const [d,mi] of [['Mar 21',0],['Mar 23',10500],['Mar 24',20100],['Mar 25',30400]])
      insertMileage.run('toyota-gr-supra', d, mi)

    for (const [n,p,f] of [
      ['Carbon Fibre Roof',1800,0],['GR Supra A90 GT Aero Kit',2400,0],['JBL Premium Sound',800,1],
      ['Head-Up Display',900,1],['Heated Seats',400,1],['Wireless CarPlay',0,1],
      ['Akrapovič Exhaust System (BMW fitment)',3200,0],
    ]) insertExtra.run('toyota-gr-supra', n, p, f)

    for (const [l,v] of [
      ['Make','Toyota'],['Model','GR Supra'],['Generation','A90 (2021+ 382hp update)'],['Engine Code','B58B30O1'],
      ['Displacement','2,998cc'],['Cylinders','Inline-6 Twin-Scroll Turbo'],['Power','382hp @ 5,800rpm'],
      ['Torque','368lb-ft @ 1,800rpm'],['Gearbox','ZF 8HP 8-speed auto'],['Drive','RWD'],
      ['Kerb Weight','1,570kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','181 g/km'],['Body','Coupe'],
    ]) insertSpec.run('toyota-gr-supra', l, v)

    for (const [l,v,c] of [
      ['Insurance',1900,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',2600,'#f59e0b'],
      ['Servicing',650,'#10b981'],['Tyres',1000,'#ef4444'],
    ]) insertCost.run('toyota-gr-supra', l, v, c)

    for (const [n,t,ic,u] of [
      ['SupraForums.com','Global','💬','https://supraforums.com'],
      ['MKV Supra Forum','A90 Dedicated','🏎️','https://mkvsupra.net'],
      ['r/Toyota','Reddit','🤖','https://reddit.com/r/Toyota'],
      ['Toyota GR UK','Official','⭐','https://toyota.co.uk/gazoo-racing'],
      ['PistonHeads Supra','UK Reviews','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('toyota-gr-supra', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','10,000 mi / 12 months','Due at 40,000 mi (9,600 mi away)',0],
      ['Brake Fluid','2 years','Due Mar 2025 — OVERDUE',1],
      ['Spark Plugs','40,000 mi','Due at 40,000 mi',0],
      ['Air Filter','30,000 mi','Due at 30,000 mi (check now)',1],
      ['Coolant','4 years','Due Mar 2025',0],
      ['Fuel Filter','40,000 mi','Due at 40,000 mi',0],
    ]) insertService.run('toyota-gr-supra', item, intv, next, urg)
  }

  // =====================
  // 7. Porsche 718 Cayman (982)
  // Market: £32.3k-£36.9k, avg £35,500, 176 listings
  // =====================
  if (!carExists.get('porsche-718-cayman')) {
    insertCar.run('porsche-718-cayman','Porsche 718 Cayman S (982)','Porsche 718 Cayman S',2021,35990,21000,
      'Racing Yellow','#f0c000','🟡',
      '2.5L Twin-Scroll Turbo Flat-4 350hp','350hp','309lb-ft','7-speed PDK','4.0s','177mph',
      'WP0ZZZ98ZMS234567',8.1,
      "Strong buy — Caymans are the best driver's car Porsche makes but nobody tells you this publicly. Lower centre of gravity than 911, better balance, and at this price the entry is compelling. 21k miles on a 2021 is low. Racing Yellow is a rare and desirable spec — adds 5% premium on resale. The 2.5T S model is the sweet spot (avoid the base 2.0T with 300hp). PDK is the better gearbox choice for most. The main concern with 982 Caymans is the water pump — an expensive failure at £800-1,200 when it goes. Budget accordingly. Values have stabilised — strong buy.",
      7380,0.7,3000,'Clean')

    for (const [n,d,s] of [
      ['Water Pump Failure','The water pump on 982/981 is engine-driven and internal. When it fails (usually 40-60k miles) coolant mixes with oil. Catastrophic if caught late. BUDGET PREVENTATIVE REPLACEMENT £800-1,200.','critical'],
      ['IMS Bearing (Flat-4 982)','Intermediate Shaft Bearing failure risk — less severe than flat-6 but still exists. Check service history for preventative replacement. Failure = engine rebuild.','high'],
      ['PDK Rough Shifting','Older PDK units can be jerky at low speeds and when cold. Fluid change often helps. Mechatronic issues on high-mileage units.','medium'],
      ['Wheel Bearing Failures','Porsche centre-lock wheels have bearings that wear faster than conventional designs. Rumbling noise from wheels = investigate immediately.','medium'],
      ['AC Condenser Leaks','Small stone damage to condenser is common on low-slung sports cars. AC stops cooling gradually. £400-600 replacement.','medium'],
      ['Carbon Buildup','GTS and flat-4 engines all use direct injection — intake walnut blast needed at 30-40k miles. Rough idle, hesitation.','medium'],
      ['Battery Drain','All the electronics need battery properly maintained. Fits to a trickle charger when stored. Dead battery can cause module resets.','low'],
    ] as [string,string,string][]) insertFault.run('porsche-718-cayman', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Feb 2025','PASS',21000,'Clean pass — no advisories'],
      ['Feb 2024','PASS',12500,'Clean pass'],
    ]) insertMot.run('porsche-718-cayman', d, r, mi, notes)

    for (const [d,p] of [['Mar 21',62000],['Sep 21',61000],['Mar 22',58000],['Sep 22',52000],['Mar 23',47000],['Sep 23',41000],['Mar 24',38000]])
      insertPrice.run('porsche-718-cayman', d, p)

    for (const [d,mi] of [['Mar 21',0],['Feb 24',12500],['Feb 25',21000]])
      insertMileage.run('porsche-718-cayman', d, mi)

    for (const [n,p,f] of [
      ['Sport Chrono Package',1900,1],['PASM (Active Suspension)',1200,1],['Bose Surround Sound',950,1],
      ['Leather Sport Seats Plus',2800,0],['LED Matrix Headlights',1800,1],
      ['Sport Exhaust',2100,0],['Rear Wiper',300,1],
    ]) insertExtra.run('porsche-718-cayman', n, p, f)

    for (const [l,v] of [
      ['Make','Porsche'],['Model','718 Cayman S'],['Generation','982'],['Engine','2.5L Turbo Flat-4'],
      ['Displacement','2,497cc'],['Power','350hp @ 6,500rpm'],['Torque','309lb-ft @ 1,900rpm'],
      ['Gearbox','7-speed PDK'],['Drive','RWD'],['Kerb Weight','1,415kg'],
      ['Fuel','Super Plus (98 RON)'],['CO2','186 g/km'],['Body','Coupe'],['0-100 km/h','4.0s'],
    ]) insertSpec.run('porsche-718-cayman', l, v)

    for (const [l,v,c] of [
      ['Insurance',2100,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',2800,'#f59e0b'],
      ['Servicing',950,'#10b981'],['Tyres',1200,'#ef4444'],
    ]) insertCost.run('porsche-718-cayman', l, v, c)

    for (const [n,t,ic,u] of [
      ['718 Forum','Global Cayman','💬','https://718forum.com'],
      ['Porsche Club GB','Official UK','🏆','https://porscheclubgb.com'],
      ['Rennlist 718','Global Forum','🌍','https://rennlist.com'],
      ['r/Porsche','Reddit','🤖','https://reddit.com/r/Porsche'],
      ['PistonHeads Cayman','UK Forum','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('porsche-718-cayman', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','10,000 mi / 12 months','Due at 30,000 mi (9,000 mi away)',0],
      ['Brake Fluid','2 years','Due Feb 2027',0],
      ['Spark Plugs','40,000 mi','Due at 40,000 mi',0],
      ['PDK Fluid','40,000 mi','Due at 40,000 mi',0],
      ['Water Pump — Preventative','40,000-50,000 mi','Budget £800-1,200 at next major service',0],
      ['Coolant','4 years','Due Feb 2025 — OVERDUE',1],
    ]) insertService.run('porsche-718-cayman', item, intv, next, urg)
  }

  // =====================
  // 8. BMW M2 (F87)
  // Market: £22k-£27.5k, avg £25,500, 236 listings
  // =====================
  if (!carExists.get('bmw-m2')) {
    insertCar.run('bmw-m2','BMW M2 Competition (F87)','BMW M2 Comp',2021,25995,33000,
      'Hockenheim Silver','#b0b4b8','🥈',
      'S55 3.0L Twin-Turbo I6 410hp','410hp','406lb-ft','7-speed DCT','4.2s','155mph',
      'WBS1J9C53M7J12345',8.0,
      "Excellent buy — the F87 M2 Competition is a modern icon. At £25,995 with 33k miles this is excellent value. S55 engine (same as F80 M3/M4) is bulletproof when maintained. DCT gearbox is spectacular. The crank hub issue that plagued S55 is less severe than S58 — monitor and budget for preventative fix if tuned. Hockenheim Silver is understated and classy. The F87 has already entered 'modern classic' territory. Compared to the new G87 M2 at £60k+, the F87 at £26k is extraordinary value for similar driving thrills. Buy it.",
      6580,-0.5,2500,'Clean')

    for (const [n,d,s] of [
      ['Crank Hub Slipping (S55)','S55 crank hub uses interference fit. Can slip under hard use, especially with tune. Preventative fix ~£600. Priority on any tuned example.','high'],
      ['Coolant System Failures','Electronic water pump, thermostat housing, coolant pipe failures — all common S55 faults. Check coolant level and temp readings.','high'],
      ['Oil Leaks (S55)','Valve cover gasket and oil filter housing gasket are known leak points. Blue smoke on startup = valve stem seals. Budget service item.','medium'],
      ['Front Subframe Cracking','F87 front subframe can crack at mounting points under hard driving. Check for any cracks or unusual suspension geometry.','medium'],
      ['DCT Clutch Pack Wear','Aggressive use wears DCT clutch packs. Vibration at low speeds = clutch pack service needed. £500-800 service.','medium'],
      ['Brake Overheating (Track)','Stock brakes adequate for road but fade on track. Pads and fluid should be upgraded for any track use.','low'],
      ['Limited Rear Seat Space','F87 is a 4-seater in name only. Rear headroom and legroom are minimal. This is a 2-seater practically.','low'],
    ] as [string,string,string][]) insertFault.run('bmw-m2', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Jan 2025','PASS',33000,'Clean pass'],
      ['Jan 2024','PASS',21500,'Clean pass'],
      ['Jan 2023','PASS',11200,'First MOT — clean pass'],
    ]) insertMot.run('bmw-m2', d, r, mi, notes)

    for (const [d,p] of [['Mar 21',48000],['Sep 21',46000],['Mar 22',43000],['Sep 22',38000],['Mar 23',33000],['Sep 23',29000],['Mar 24',27000]])
      insertPrice.run('bmw-m2', d, p)

    for (const [d,mi] of [['Mar 21',0],['Jan 23',11200],['Jan 24',21500],['Jan 25',33000]])
      insertMileage.run('bmw-m2', d, mi)

    for (const [n,p,f] of [
      ['M Performance Exhaust',2500,0],['Carbon Fibre Package',2200,0],['Harman Kardon Sound',850,1],
      ['M Driver Package (175mph)',1200,0],['Heated Seats',450,1],['M Sport Brakes (Orange)',0,1],
      ['Wireless CarPlay',0,1],
    ]) insertExtra.run('bmw-m2', n, p, f)

    for (const [l,v] of [
      ['Make','BMW'],['Model','M2 Competition'],['Generation','F87'],['Engine Code','S55B30T0'],
      ['Displacement','2,979cc'],['Cylinders','Inline-6 Twin-Turbo'],['Power','410hp @ 6,250rpm'],
      ['Torque','406lb-ft @ 4,000rpm'],['Gearbox','7-speed M DCT'],['Drive','RWD'],
      ['Kerb Weight','1,560kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','218 g/km'],['Body','Coupe'],
    ]) insertSpec.run('bmw-m2', l, v)

    for (const [l,v,c] of [
      ['Insurance',1800,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',2600,'#f59e0b'],
      ['Servicing',700,'#10b981'],['Tyres',950,'#ef4444'],
    ]) insertCost.run('bmw-m2', l, v, c)

    for (const [n,t,ic,u] of [
      ['F87 M2 Forum','Dedicated F87','💬','https://bmwf87.com'],
      ['BimmerPost F87','Global','🌍','https://f87.bimmerpost.com'],
      ['BMW M2 Owners UK','UK Club','🏴','#'],
      ['r/BMW','Reddit','🤖','https://reddit.com/r/BMW'],
      ['M2 Competition Group UK','Facebook','📘','#'],
    ]) insertCommunity.run('bmw-m2', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','10,000 mi / 12 months','Due at 40,000 mi (7,000 mi away)',0],
      ['Brake Fluid','2 years','Due Jan 2027',0],
      ['DCT Fluid & Filter','40,000 mi','Due at 40,000 mi',0],
      ['Spark Plugs','30,000 mi','Due now — OVERDUE at 33,000 mi',1],
      ['Coolant','4 years','Due Jan 2025 — OVERDUE',1],
      ['Air Filter','30,000 mi','Due now — OVERDUE',1],
    ]) insertService.run('bmw-m2', item, intv, next, urg)
  }

  // =====================
  // 9. Audi TT RS (8S)
  // Market: £28k-£36.5k, avg £33,500, 24 listings
  // =====================
  if (!carExists.get('audi-tt-rs')) {
    insertCar.run('audi-tt-rs','Audi TT RS Coupe (8S)','Audi TT RS',2021,34495,45500,
      'Navarra Blue Metallic','#1b3a5a','🔵',
      '2.5 TFSI 5-cylinder 400hp','400hp','354lb-ft','7-speed S tronic quattro','3.7s','155mph',
      'TRUZZZGJ3M1012345',7.9,
      "Collector's buy — the TT RS has been discontinued. This is the last great TT, and its value should stabilise or rise as supply dries up. Only 24 on AutoTrader nationally. The 5-cylinder soundtrack is genuinely unique — a burbling snarl unlike anything else. 45k miles on a 2021 is acceptable for this type of car. Navarra Blue is a stunning spec. The DAZA 5-cylinder is largely the same unit as the RS3 — excellent reliability when maintained. The 8S platform is peak Audi engineering. Buy this and keep it.",
      7580,-0.5,3000,'Clean')

    for (const [n,d,s] of [
      ['Injector Failures','DAZA engine shares the RS3 injector weakness. Catastrophic failure if ignored. Replace preventatively at 60-70k miles with genuine Audi parts.','critical'],
      ['DSG Whine','7-speed S tronic can whine on upshifts. Known issue, linked to DSG pump. Check for progression — may require gearbox service.','high'],
      ['Carbon Buildup (Intake)','Direct injection 5-cyl needs walnut blast at 30-40k miles. Rough idle and hesitation indicates buildup.','high'],
      ['Suspension Bushing Wear','Sporty MQB-based suspension wears bushings faster than comfort-oriented cars. Clunking over bumps.','medium'],
      ['Rear Wishbone Compliance Bushings','Rear suspension compliance bushings wear under load. Affects stability and geometry. Annual inspection recommended.','medium'],
      ['Turbo Hose Splits','Under high boost, intake hoses can develop micro-cracks. Boost loss, rough running. Check all hose connections.','medium'],
      ['Infotainment (MMI) Laggy','Older MMI system feels dated compared to current Audi offerings. CarPlay retrofit helps usability.','low'],
    ] as [string,string,string][]) insertFault.run('audi-tt-rs', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Mar 2025','PASS',45500,'Clean pass — advisory rear tyre wear'],
      ['Mar 2024','PASS',33000,'Clean pass'],
      ['Mar 2023','PASS',18500,'Clean pass'],
    ]) insertMot.run('audi-tt-rs', d, r, mi, notes)

    for (const [d,p] of [['Mar 21',65000],['Sep 21',62000],['Mar 22',57000],['Sep 22',50000],['Mar 23',44000],['Sep 23',39000],['Mar 24',36000]])
      insertPrice.run('audi-tt-rs', d, p)

    for (const [d,mi] of [['Mar 21',0],['Mar 23',18500],['Mar 24',33000],['Mar 25',45500]])
      insertMileage.run('audi-tt-rs', d, mi)

    for (const [n,p,f] of [
      ['RS Sport Exhaust',1800,1],['RS Design Package (Opal White)',1200,0],['B&O Sound',1200,1],
      ['Matrix LED Headlights',1800,1],['Audi Virtual Cockpit Plus',800,1],
      ['Sport Seats (Nappa Leather)',2400,0],['Ceramic Brakes (CCBC)',4500,0],
    ]) insertExtra.run('audi-tt-rs', n, p, f)

    for (const [l,v] of [
      ['Make','Audi'],['Model','TT RS Coupe'],['Generation','8S (Final Edition)'],['Engine Code','DAZA'],
      ['Displacement','2,480cc'],['Cylinders','Inline-5 Turbo'],['Power','400hp @ 5,850rpm'],
      ['Torque','354lb-ft @ 1,700rpm'],['Gearbox','7-speed S tronic DSG'],['Drive','quattro AWD'],
      ['Kerb Weight','1,450kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','199 g/km'],['Body','Coupe'],
    ]) insertSpec.run('audi-tt-rs', l, v)

    for (const [l,v,c] of [
      ['Insurance',2000,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',2600,'#f59e0b'],
      ['Servicing',700,'#10b981'],['Tyres',1000,'#ef4444'],
    ]) insertCost.run('audi-tt-rs', l, v, c)

    for (const [n,t,ic,u] of [
      ['TTRS Forum','Audi TT RS Dedicated','💬','#'],
      ['Audizine TT RS','Global Forum','🌍','https://audizine.com'],
      ['RS246.com','Audi RS Club','🏎️','https://rs246.com'],
      ['r/Audi','Reddit','🤖','https://reddit.com/r/Audi'],
      ['Audi Sport UK','Official Club','🏆','#'],
    ]) insertCommunity.run('audi-tt-rs', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','9,300 mi / 12 months','Due now — at 45,500 mi',1],
      ['Brake Fluid','2 years','Due Mar 2025 — OVERDUE',1],
      ['DSG Fluid & Filter','40,000 mi','Due now — OVERDUE',1],
      ['Walnut Blast Intake Clean','30,000 mi','Due now — OVERDUE at 45,500 mi',1],
      ['Haldex Coupling Fluid','20,000 mi','Due now — OVERDUE',1],
      ['Spark Plugs','40,000 mi','Due at 40,000 mi — OVERDUE',1],
    ]) insertService.run('audi-tt-rs', item, intv, next, urg)
  }

  // =====================
  // 10. Mercedes-AMG C63 (W205)
  // Market: £12.5k-£52k, avg £28,000, 375 listings
  // =====================
  if (!carExists.get('mercedes-c63-amg')) {
    insertCar.run('mercedes-c63-amg','Mercedes-AMG C63 S Estate (W205)','Mercedes C63 S',2020,38500,42000,
      'Selenite Grey Metallic','#6e7272','⬛',
      'AMG 4.0L V8 BiTurbo 510hp','510hp','516lb-ft','9-speed AMG Speedshift MCT','4.0s','155mph',
      'WDD2050072F123456',7.5,
      "Emotional buy with caveats — a V8 BiTurbo C63 S Estate is one of the great everyday performance cars. 510hp, 4-door estate practicality, sounds absolutely savage. At £38,500 with 42k miles this is well-priced for the spec. But: the W205 C63 has some serious reliability concerns. The M177 V8 is sensitive to maintenance — any missed oil change can cause bore scoring. The 9-speed MCT gearbox does not love spirited use. Budget £2,000/year for unexpected costs. With full AMG service history, this is manageable. Without — walk away.",
      8280,0.4,4000,'Clean')

    for (const [n,d,s] of [
      ['Engine Bore Scoring','M177 V8 can suffer bore scoring under oil starvation or during cold-start thrashing. Rebuild costs £8,000+. Full service history is non-negotiable.','critical'],
      ['MCT Gearbox Judder','9-speed MCT (not traditional torque converter) can judder at low speeds. Common complaint. Adapt mode or TCU update may help.','high'],
      ['Catalytic Converter Theft','V8 exhaust system = high-value catalysts. Theft risk very high. Catloc essential. Insurance often requires it.','high'],
      ['Engine Mounts Deterioration','Firm AMG mounts degrade from vibration and heat. Vibration at idle increases markedly when worn. £400-600 replacement set.','high'],
      ['Airmatic Suspension Issues','Estate models with Airmatic air suspension can develop leaks and compressor failures. Expensive to fix — budget £800-2,500 per corner.','high'],
      ['Coolant System Hoses','W205-era coolant hoses are known to crack and leak. Check for any coolant smell and watch temperature gauge.','medium'],
      ['Fuel Injector Noise','V8 direct injection creates noticeable injector noise (diesel rattle effect). Normal at low RPM but concerning if very loud.','low'],
    ] as [string,string,string][]) insertFault.run('mercedes-c63-amg', n, d, s)

    for (const [d,r,mi,notes] of [
      ['May 2025','PASS',42000,'Clean pass'],
      ['May 2024','PASS',28500,'Advisory: minor brake squeal'],
      ['May 2023','PASS',15200,'Clean pass'],
    ]) insertMot.run('mercedes-c63-amg', d, r, mi, notes)

    for (const [d,p] of [['Mar 20',88000],['Mar 21',80000],['Mar 22',72000],['Mar 23',58000],['Mar 24',48000],['Sep 24',41000],['Mar 25',38000]])
      insertPrice.run('mercedes-c63-amg', d, p)

    for (const [d,mi] of [['Mar 20',0],['May 23',15200],['May 24',28500],['May 25',42000]])
      insertMileage.run('mercedes-c63-amg', d, mi)

    for (const [n,p,f] of [
      ['AMG Driver Package (180mph)',3000,1],['Burmester Surround Sound',2800,1],['AMG Night Package',850,1],
      ['Panoramic Roof',1800,1],['AMG Performance Steering Wheel',600,1],
      ['Head-Up Display',1100,1],['Rear Seat Entertainment',1500,0],
    ]) insertExtra.run('mercedes-c63-amg', n, p, f)

    for (const [l,v] of [
      ['Make','Mercedes-AMG'],['Model','C63 S Estate'],['Generation','W205'],['Engine Code','M177'],
      ['Displacement','3,982cc'],['Cylinders','V8 BiTurbo'],['Power','510hp @ 5,500rpm'],
      ['Torque','516lb-ft @ 1,750rpm'],['Gearbox','9-speed AMG MCT'],['Drive','RWD'],
      ['Kerb Weight','1,800kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','233 g/km'],['Body','Estate'],
    ]) insertSpec.run('mercedes-c63-amg', l, v)

    for (const [l,v,c] of [
      ['Insurance',2400,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',3400,'#f59e0b'],
      ['Servicing',1200,'#10b981'],['Tyres',1400,'#ef4444'],
    ]) insertCost.run('mercedes-c63-amg', l, v, c)

    for (const [n,t,ic,u] of [
      ['MBWorld C63','Global Forum','💬','https://mbworld.org'],
      ['AMG Owners Club UK','Official','🏆','https://amgownersclub.co.uk'],
      ['C63 AMG Forum UK','UK Dedicated','🏴','#'],
      ['r/AMG','Reddit','🤖','https://reddit.com/r/AMG'],
      ['PistonHeads C63','UK Reviews','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('mercedes-c63-amg', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter (Full Synthetic)','10,000 mi / 12 months','Due at 50,000 mi (8,000 mi away)',0],
      ['Brake Fluid','2 years','Due May 2025 — OVERDUE',1],
      ['Spark Plugs','40,000 mi','Due now — OVERDUE at 42,000 mi',1],
      ['Transmission Fluid (MCT)','40,000 mi','Due now — OVERDUE',1],
      ['Coolant System Inspection','Annually','Check hoses now — known issue',1],
      ['Air Filter','20,000 mi','Due now — OVERDUE',1],
    ]) insertService.run('mercedes-c63-amg', item, intv, next, urg)
  }

  // =====================
  // 11. BMW M340i xDrive
  // Market: £25k-£40k, avg £30,000, 182 listings
  // =====================
  if (!carExists.get('bmw-m340i')) {
    insertCar.run('bmw-m340i','BMW M340i xDrive (G20)','BMW M340i',2021,30500,38000,
      'Mineral Grey Metallic','#777e85','⬜',
      'B58 3.0L Turbo I6 374hp','374hp','369lb-ft','8-speed ZF auto xDrive','4.4s','155mph',
      'WBA5U9107MCH23456',7.7,
      "Balanced everyday performance — the M340i is the M3 for people who live in the real world. Same B58 engine (bulletproof), xDrive AWD, 374hp, £30k. 38k miles on a 2021 is perfectly normal. This is the car for daily driving excellence. Not as exciting as the M3 but it has a proper back seat, a proper boot, and enough performance to put most cars to shame. The B58 rewards with a lifetime of reliability if properly serviced. Check the ZF gearbox has had fluid changes — often neglected by owners who do not know it needs it.",
      6880,-0.5,2800,'Clean')

    for (const [n,d,s] of [
      ['B58 Valve Cover Gasket','Valve cover gasket oil leak is common B58 issue. Oil burns on exhaust manifold causing smell. £200-400 fix.','medium'],
      ['xDrive Transfer Case Noise','Transfer case can develop whine on high-mileage examples. Regular fluid change helps. Monitor for progression.','medium'],
      ['ZF Gearbox Fluid Neglect','Many owners do not know the ZF 8HP is a "lifetime" fluid gearbox (it is not). Fluid change at 40k miles dramatically improves shift quality.','medium'],
      ['Headlight Moisture','Early G20 had headlight moisture ingress. Check for any condensation. Dealer rectification available.','low'],
      ['Idler Pulley Wear','Drive belt idler pulleys wear and can cause squealing. Progressive failure. Replace at any sign of noise.','medium'],
      ['Brake Dust (M Performance Brakes)','Performance spec brakes produce significant dust. Cosmetic concern but staining wheels constantly.','low'],
    ] as [string,string,string][]) insertFault.run('bmw-m340i', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Feb 2025','PASS',38000,'Clean pass'],
      ['Feb 2024','PASS',26000,'Clean pass'],
      ['Feb 2023','PASS',14500,'Clean pass'],
    ]) insertMot.run('bmw-m340i', d, r, mi, notes)

    for (const [d,p] of [['Mar 21',53000],['Sep 21',50000],['Mar 22',46000],['Sep 22',40000],['Mar 23',36000],['Sep 23',33000],['Mar 24',31000]])
      insertPrice.run('bmw-m340i', d, p)

    for (const [d,mi] of [['Mar 21',0],['Feb 23',14500],['Feb 24',26000],['Feb 25',38000]])
      insertMileage.run('bmw-m340i', d, mi)

    for (const [n,p,f] of [
      ['M Sport Pro Pack',3500,1],['Harman Kardon Sound',850,1],['Panoramic Roof',1200,1],
      ['Head-Up Display',900,1],['Heated Front & Rear Seats',950,1],
      ['Adaptive LED Headlights',900,1],['Parking Assistant Plus',750,1],
    ]) insertExtra.run('bmw-m340i', n, p, f)

    for (const [l,v] of [
      ['Make','BMW'],['Model','M340i xDrive'],['Generation','G20 (3 Series)'],['Engine Code','B58B30O1'],
      ['Displacement','2,998cc'],['Cylinders','Inline-6 Turbo'],['Power','374hp @ 5,800rpm'],
      ['Torque','369lb-ft @ 1,600rpm'],['Gearbox','ZF 8HP 8-speed auto'],['Drive','xDrive AWD'],
      ['Kerb Weight','1,770kg'],['Fuel','Super Unleaded (95 RON)'],['CO2','159 g/km'],['Body','Saloon'],
    ]) insertSpec.run('bmw-m340i', l, v)

    for (const [l,v,c] of [
      ['Insurance',1600,'#3b82f6'],['Road Tax',185,'#8b5cf6'],['Fuel',2600,'#f59e0b'],
      ['Servicing',600,'#10b981'],['Tyres',850,'#ef4444'],
    ]) insertCost.run('bmw-m340i', l, v, c)

    for (const [n,t,ic,u] of [
      ['BimmerPost G20','Global Forum','💬','https://g20.bimmerpost.com'],
      ['BMW M340i Owners UK','UK','🏴','#'],
      ['r/BMW','Reddit','🤖','https://reddit.com/r/BMW'],
      ['3Series.net','Dedicated','🗣️','https://3series.net'],
      ['PistonHeads M340i','UK Reviews','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('bmw-m340i', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','10,000 mi / 12 months','Due at 40,000 mi (2,000 mi away)',1],
      ['Brake Fluid','2 years','Due Feb 2027',0],
      ['ZF Transmission Fluid','40,000 mi','Due now — OVERDUE at 38,000 mi',1],
      ['xDrive Transfer Case Fluid','40,000 mi','Due at 40,000 mi',0],
      ['Spark Plugs','40,000 mi','Due at 40,000 mi',0],
      ['Coolant','4 years','Due Feb 2025 — OVERDUE',1],
    ]) insertService.run('bmw-m340i', item, intv, next, urg)
  }

  // =====================
  // 12. Audi S3 (8Y)
  // Market: £17k-£31k, avg £22,000, 250 listings
  // =====================
  if (!carExists.get('audi-s3')) {
    insertCar.run('audi-s3','Audi S3 Saloon (8Y)','Audi S3 Saloon',2022,23500,24000,
      'Tango Red Metallic','#c0392b','🔴',
      'EA888 Evo4 2.0 TFSI 310hp','310hp','295lb-ft','7-speed S tronic quattro','4.8s','155mph',
      'WAUAAAAAGNA012345',7.3,
      "Practical daily driver with genuine performance credentials. The 8Y S3 is the sleeper of the group — looks like any Audi saloon, secretly has 310hp and quattro AWD. 24k miles on a 2022 is low. Tango Red is a premium colour adding ~£800 value on resale. Running costs are some of the lowest in this watchlist. The DSG gearbox concern in S3s is less severe than RS3 (lower power and heat). But the EA888 needs proper oil maintenance. Full Audi service history verified. Good daily, good commuter, surprising on B-roads.",
      5280,0.7,2500,'Clean')

    for (const [n,d,s] of [
      ['DSG Shudder on Cold Start','7-speed wet-clutch DSG shudders when cold. Usually resolves when warm. Persistent cases need adaptation reset or fluid change.','medium'],
      ['Carbon Buildup','EA888 evo4 direct injection — walnut blast intake cleaning needed at 30k miles. Minor rough idle.','medium'],
      ['Oil Consumption (EA888)','Regular oil consumption is normal, especially under performance driving. Check between services.','medium'],
      ['quattro Haldex Service','Haldex rear coupling needs fluid change every 20k miles. Neglect causes rear engagement loss.','medium'],
      ['Wheel Bearing Wear','Performance driving accelerates front wheel bearing wear. Droning noise from wheel area = investigate.','low'],
      ['Virtual Cockpit Glitches','Occasional display glitches and freeze — software updates resolve most cases.','low'],
    ] as [string,string,string][]) insertFault.run('audi-s3', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Mar 2025','PASS',24000,'Clean pass'],
      ['Mar 2024','PASS',12000,'Clean pass'],
    ]) insertMot.run('audi-s3', d, r, mi, notes)

    for (const [d,p] of [['Mar 22',44000],['Sep 22',41000],['Mar 23',37000],['Sep 23',31000],['Mar 24',27000],['Sep 24',24500],['Mar 25',23000]])
      insertPrice.run('audi-s3', d, p)

    for (const [d,mi] of [['Mar 22',0],['Mar 24',12000],['Mar 25',24000]])
      insertMileage.run('audi-s3', d, mi)

    for (const [n,p,f] of [
      ['S3 Dynamic Package',2500,1],['B&O Sound System',1000,1],['Panoramic Roof',1200,0],
      ['Audi Virtual Cockpit Plus',500,1],['Heated Front Seats',450,1],
      ['Matrix LED Headlights',1500,1],['Wireless CarPlay',0,1],
    ]) insertExtra.run('audi-s3', n, p, f)

    for (const [l,v] of [
      ['Make','Audi'],['Model','S3 Saloon'],['Generation','8Y'],['Engine Code','EA888 Evo4'],
      ['Displacement','1,984cc'],['Cylinders','Inline-4 Turbo'],['Power','310hp @ 5,450rpm'],
      ['Torque','295lb-ft @ 2,000rpm'],['Gearbox','7-speed S tronic DSG'],['Drive','quattro AWD'],
      ['Kerb Weight','1,530kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','154 g/km'],['Body','Saloon'],
    ]) insertSpec.run('audi-s3', l, v)

    for (const [l,v,c] of [
      ['Insurance',1400,'#3b82f6'],['Road Tax',185,'#8b5cf6'],['Fuel',2200,'#f59e0b'],
      ['Servicing',500,'#10b981'],['Tyres',700,'#ef4444'],
    ]) insertCost.run('audi-s3', l, v, c)

    for (const [n,t,ic,u] of [
      ['Audizine S3','Forum','💬','https://audizine.com'],
      ['8Y S3 Forum','8Y Dedicated','🏎️','#'],
      ['Audi Sport UK','Club','🏆','#'],
      ['r/Audi','Reddit','🤖','https://reddit.com/r/Audi'],
      ['PistonHeads S3','Reviews','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('audi-s3', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','9,300 mi / 12 months','Due at 30,000 mi (6,000 mi away)',0],
      ['Brake Fluid','2 years','Due Mar 2026',0],
      ['Haldex Fluid','20,000 mi','Due now — OVERDUE',1],
      ['DSG Fluid & Filter','40,000 mi','Due at 40,000 mi',0],
      ['Air Filter','20,000 mi','Due now — OVERDUE',1],
      ['Walnut Blast','30,000 mi','Due at 30,000 mi',0],
    ]) insertService.run('audi-s3', item, intv, next, urg)
  }

  // =====================
  // 13. Alfa Romeo Giulia Quadrifoglio
  // Market: £27k-£48k, avg £40,000, 21 listings
  // =====================
  if (!carExists.get('alfa-romeo-giulia-qv')) {
    insertCar.run('alfa-romeo-giulia-qv','Alfa Romeo Giulia Quadrifoglio','Alfa Giulia QV',2020,38500,32000,
      'Alfa Red','#cc0000','🔴',
      'Ferrari-derived 2.9 V6 BiTurbo 510hp','510hp','443lb-ft','8-speed ZF auto RWD','3.9s','191mph',
      'ZAR95200007123456',7.4,
      "Italian soul, Ferrari engine — but buy with your eyes open. The Giulia QV with Ferrari-derived V6 is genuinely intoxicating. 510hp, RWD, Nürburgring record holder (2016). 32k miles on a 2020 is reasonable. Alfa Red is the only spec. The problem: it is an Alfa. Electrical gremlins are almost guaranteed. The Ferrari engine is actually reliable — it is everything else. Infotainment freezing, random warning lights, window regulator failures. Pre-purchase inspection with a specialist (NOT a main Alfa dealer) is essential. If it checks out — one of the most exciting cars you can own.",
      8280,1.2,4200,'Clean')

    for (const [n,d,s] of [
      ['Electrical Gremlins (Multiple)','This is an Alfa. Random warning lights, sensor failures, window regulators, infotainment crashes are EXPECTED. Budget £500-1,000/year for electrical surprise items.','high'],
      ['Window Regulator Failures','Front window regulators fail frequently. Window drops into door and won\'t raise. £150-300 to fix but happens repeatedly.','high'],
      ['Infotainment System Crashes','The 8.8" system freezes, loses CarPlay connection, requires reboots. Annoyance rather than safety concern.','medium'],
      ['Suspension Component Wear','Performance suspension components wear faster than on comparable German cars. DNA selector bushings, control arms. Annual inspection needed.','high'],
      ['Rear Subframe Cracking','Known issue on early QV models — rear subframe stress cracks. Check service history for the factory repair kit installation.','critical'],
      ['Coolant Pump Failures','Electric coolant pump failures can cause overheating risk. Check for any coolant warnings. £400-600 replacement.','high'],
      ['Clutch Pack (Carbon Ceramic Option)','Cars fitted with CCM brakes need specific bedding procedure. Incorrect use causes rapid delamination of carbon material.','medium'],
    ] as [string,string,string][]) insertFault.run('alfa-romeo-giulia-qv', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Apr 2025','PASS',32000,'Clean pass'],
      ['Apr 2024','PASS',21000,'Advisory: minor suspension bush wear'],
      ['Apr 2023','PASS',10500,'First MOT — clean pass'],
    ]) insertMot.run('alfa-romeo-giulia-qv', d, r, mi, notes)

    for (const [d,p] of [['Mar 20',79000],['Sep 20',75000],['Mar 21',70000],['Sep 21',62000],['Mar 22',55000],['Mar 23',48000],['Mar 24',42000]])
      insertPrice.run('alfa-romeo-giulia-qv', d, p)

    for (const [d,mi] of [['Mar 20',0],['Apr 23',10500],['Apr 24',21000],['Apr 25',32000]])
      insertMileage.run('alfa-romeo-giulia-qv', d, mi)

    for (const [n,p,f] of [
      ['Veloce Sport Pack',2200,1],['Carbon Fibre Interior Trim',1800,1],['Harman Kardon Sound',900,1],
      ['Carbon Ceramic Brakes (CCM)',7500,0],['Forged 20" Alloys',1500,0],
      ['Heated Seats',450,1],['Active Exhaust',2000,1],
    ]) insertExtra.run('alfa-romeo-giulia-qv', n, p, f)

    for (const [l,v] of [
      ['Make','Alfa Romeo'],['Model','Giulia Quadrifoglio'],['Generation','Type 952'],
      ['Engine','Ferrari-derived 2.9L V6 BiTurbo'],['Displacement','2,891cc'],['Power','510hp @ 6,500rpm'],
      ['Torque','443lb-ft @ 2,500rpm'],['Gearbox','ZF 8HP 8-speed auto'],['Drive','RWD'],
      ['Kerb Weight','1,580kg'],['Fuel','Super Plus (98 RON)'],['CO2','218 g/km'],['Body','Saloon'],
    ]) insertSpec.run('alfa-romeo-giulia-qv', l, v)

    for (const [l,v,c] of [
      ['Insurance',2400,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',3200,'#f59e0b'],
      ['Servicing',1000,'#10b981'],['Tyres',1400,'#ef4444'],
    ]) insertCost.run('alfa-romeo-giulia-qv', l, v, c)

    for (const [n,t,ic,u] of [
      ['AlfaOwner.com','UK Forum','💬','https://alfaowner.com'],
      ['Alfa Romeo UK Owners Club','Official','🏆','#'],
      ['Giulia QV Forum','Dedicated','🏎️','#'],
      ['r/AlfaRomeo','Reddit','🤖','https://reddit.com/r/AlfaRomeo'],
      ['PistonHeads Giulia QV','Reviews','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('alfa-romeo-giulia-qv', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter (Full Synthetic)','7,500 mi / 12 months','Due now — at 32,000 mi',1],
      ['Brake Fluid','1 year (Alfa recommendation)','Due Apr 2025 — OVERDUE',1],
      ['Spark Plugs','30,000 mi','Due now — at 32,000 mi',1],
      ['Transmission Fluid','40,000 mi','Due at 40,000 mi',0],
      ['Coolant Pump Inspection','Annually','Inspect immediately — known failure',1],
      ['Suspension Inspection','Annually','Check all bushes and arms',0],
    ]) insertService.run('alfa-romeo-giulia-qv', item, intv, next, urg)
  }

  // =====================
  // 14. Porsche Macan S
  // Market: £24.6k-£50k, avg £31,000, 859 listings
  // =====================
  if (!carExists.get('porsche-macan')) {
    insertCar.run('porsche-macan','Porsche Macan S (95B)','Porsche Macan S',2021,34500,28000,
      'Miami Blue','#0088cc','🔵',
      '2.9L Twin-Turbo V6 380hp','380hp','383lb-ft','7-speed PDK','4.6s','168mph',
      'WP1AB2A98MLA12345',8.0,
      "Best value Porsche in the watchlist — 859 Macans on AutoTrader gives buyers real choice and negotiating power. The Macan S with twin-turbo V6 is the sweet spot — £34,500, 28k miles, Miami Blue. The Macan drives unlike anything else in the SUV segment; it is essentially a 911 raised 6 inches. PDK gearbox is typically excellent at this age. Main concern: verify no oil leaks from the V6 and check the DSP fuel pump (common failure on N/A engines, less so V6). Miami Blue is a premium paint. Porsche residuals protect your investment. Sensible premium car.",
      7380,0.4,3500,'Clean')

    for (const [n,d,s] of [
      ['Intermediate Shaft Bearing','The early Macan flat-6 had IMS bearing issues. The 2.9 V6 in the S model is LESS affected — different architecture. Verify engine variant.','medium'],
      ['Coolant Hose Leaks','Coolant expansion tank hoses can crack and leak. Check for low coolant level and sweet smell. Inexpensive fix but watch for overheating if missed.','high'],
      ['PDK Rough Shifting (Cold)','PDK in Macan can be jerky when cold, especially in low-speed manoeuvring. Warms out. Fluid change helps older units.','medium'],
      ['Oil Leaks (V6)','Valve cover gasket and oil pan seal leaks are common. Blue smoke on startup from burning oil on exhaust manifold.','medium'],
      ['DSG Actuator Failures','Gear selector actuator can fail, leaving car stuck in one gear. Warning light precedes failure. £500-800 replacement.','high'],
      ['Air Suspension (Optional)','Cars with PASM air suspension can develop leaks. Check for any lean or ride height inconsistency.','medium'],
      ['Rear Brake Caliper Seizure','Rear electronic parking brake calipers can seize, causing uneven wear. Service parking brake mechanism annually.','medium'],
    ] as [string,string,string][]) insertFault.run('porsche-macan', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Jan 2025','PASS',28000,'Clean pass'],
      ['Jan 2024','PASS',18500,'Clean pass'],
      ['Jan 2023','PASS',9200,'Clean pass'],
    ]) insertMot.run('porsche-macan', d, r, mi, notes)

    for (const [d,p] of [['Mar 21',64000],['Sep 21',62000],['Mar 22',58000],['Sep 22',52000],['Mar 23',45000],['Sep 23',39000],['Mar 24',36000]])
      insertPrice.run('porsche-macan', d, p)

    for (const [d,mi] of [['Mar 21',0],['Jan 23',9200],['Jan 24',18500],['Jan 25',28000]])
      insertMileage.run('porsche-macan', d, mi)

    for (const [n,p,f] of [
      ['Sport Chrono Package',1900,1],['Panoramic Roof',1800,1],['BOSE Surround Sound',1000,1],
      ['LED Matrix Headlights (PDLS+)',2200,1],['Heated Seats (Front + Rear)',1100,1],
      ['Off-Road Design Package',850,0],['Tow Bar',900,0],
    ]) insertExtra.run('porsche-macan', n, p, f)

    for (const [l,v] of [
      ['Make','Porsche'],['Model','Macan S'],['Generation','95B (2018 facelift)'],
      ['Engine','2.9L Twin-Turbo V6'],['Displacement','2,894cc'],['Power','380hp @ 6,400rpm'],
      ['Torque','383lb-ft @ 1,800rpm'],['Gearbox','7-speed PDK'],['Drive','AWD'],
      ['Kerb Weight','1,850kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','219 g/km'],['Body','5-door SUV'],
    ]) insertSpec.run('porsche-macan', l, v)

    for (const [l,v,c] of [
      ['Insurance',1900,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',2800,'#f59e0b'],
      ['Servicing',900,'#10b981'],['Tyres',1100,'#ef4444'],
    ]) insertCost.run('porsche-macan', l, v, c)

    for (const [n,t,ic,u] of [
      ['MacanForum.com','Global','💬','https://macanforum.com'],
      ['Porsche Club GB','Official','🏆','https://porscheclubgb.com'],
      ['Rennlist Macan','Forum','🌍','https://rennlist.com'],
      ['r/Porsche','Reddit','🤖','https://reddit.com/r/Porsche'],
      ['PistonHeads Macan','UK Reviews','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('porsche-macan', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','10,000 mi / 12 months','Due at 30,000 mi (2,000 mi away)',1],
      ['Brake Fluid','2 years','Due Jan 2027',0],
      ['PDK Fluid','40,000 mi','Due at 40,000 mi',0],
      ['Spark Plugs','40,000 mi','Due at 40,000 mi',0],
      ['Coolant Hose Inspection','Annually','Inspect now — known failure item',1],
      ['Air Filter','30,000 mi','Due at 30,000 mi (2,000 mi away)',0],
    ]) insertService.run('porsche-macan', item, intv, next, urg)
  }

  // =====================
  // 15. BMW X3 M Competition
  // Market: £34k-£65k, avg £41,000, 105 listings
  // =====================
  if (!carExists.get('bmw-x3m')) {
    insertCar.run('bmw-x3m','BMW X3 M Competition (F97)','BMW X3 M Comp',2021,42500,28500,
      'Toronto Red Metallic','#9b1515','🔴',
      'S58 3.0L Twin-Turbo I6 510hp','510hp','479lb-ft','8-speed M Steptronic xDrive','4.1s','177mph',
      'WBS4W9C09M5F12345',7.6,
      "Performance SUV with M3 engine — the X3 M Competition shares the S58 engine with the M3/M4. 510hp in an SUV is properly fast. At £42,500 with 28.5k miles, this is below the current market (£41k average but this is a well-specced 2021). Toronto Red Metallic is a £2,500 option that adds resale premium. Same S58 concerns apply (oil leaks, cooling). The xDrive AWD is brilliant in real conditions. Running costs are higher than M3 due to SUV tyres and weight. If you need space + performance, there's nothing better at this price.",
      8380,-0.8,5500,'Clean')

    for (const [n,d,s] of [
      ['S58 Oil Leaks','Same S58 valve cover and oil filter housing leaks as M3/M4. Budget for oil service vigilance and gasket checks.','high'],
      ['S58 Cooling System','Electronic water pump, thermostat, and coolant sensor failures. X3 M adds extra thermal load due to SUV weight.','high'],
      ['Air Suspension Leaks (Optional)','X3 M Competition with air suspension develops leaks over time. £800-2,500 per corner. Check for any lean.','medium'],
      ['Crank Hub (S58 xDrive)','Less of a concern in AWD application than RWD, but still monitor. Aftermarket fix available.','medium'],
      ['Tyre Wear (Performance SUV)','High-performance 275-section rear tyres wear quickly under the weight of the SUV. Budget £1,800-2,400/set.','medium'],
      ['Transfer Case Service','M xDrive transfer case needs regular fluid changes. Neglect causes AWD degradation.','medium'],
      ['Brake Disc Warping','Heavy SUV + performance stopping = brake discs prone to warping under repeated hard use.','medium'],
    ] as [string,string,string][]) insertFault.run('bmw-x3m', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Mar 2025','PASS',28500,'Clean pass'],
      ['Mar 2024','PASS',17500,'Clean pass'],
      ['Mar 2023','PASS',8200,'First MOT — clean pass'],
    ]) insertMot.run('bmw-x3m', d, r, mi, notes)

    for (const [d,p] of [['Mar 21',79000],['Sep 21',77000],['Mar 22',73000],['Sep 22',65000],['Mar 23',57000],['Sep 23',49000],['Mar 24',44000]])
      insertPrice.run('bmw-x3m', d, p)

    for (const [d,mi] of [['Mar 21',0],['Mar 23',8200],['Mar 24',17500],['Mar 25',28500]])
      insertMileage.run('bmw-x3m', d, mi)

    for (const [n,p,f] of [
      ['M Carbon Bucket Seats',4500,0],['Harman Kardon Sound',850,1],['Panoramic Roof',1200,1],
      ['Head-Up Display',1100,1],['Laser Headlights',1500,1],['M Driver Package',2500,0],
      ['Off-Road Package',600,0],
    ]) insertExtra.run('bmw-x3m', n, p, f)

    for (const [l,v] of [
      ['Make','BMW'],['Model','X3 M Competition'],['Generation','F97'],['Engine Code','S58B30T0'],
      ['Displacement','2,993cc'],['Cylinders','Inline-6 Twin-Turbo'],['Power','510hp @ 6,250rpm'],
      ['Torque','479lb-ft @ 2,600rpm'],['Gearbox','ZF 8HP M Steptronic'],['Drive','M xDrive AWD'],
      ['Kerb Weight','1,940kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','216 g/km'],['Body','5-door SUV'],
    ]) insertSpec.run('bmw-x3m', l, v)

    for (const [l,v,c] of [
      ['Insurance',2000,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',3200,'#f59e0b'],
      ['Servicing',900,'#10b981'],['Tyres',1800,'#ef4444'],
    ]) insertCost.run('bmw-x3m', l, v, c)

    for (const [n,t,ic,u] of [
      ['BimmerPost F97','Forum','💬','https://f97.bimmerpost.com'],
      ['BMW M Owners Club UK','Official','🏆','#'],
      ['X3 M Forum UK','UK Dedicated','🏴','#'],
      ['r/BMW','Reddit','🤖','https://reddit.com/r/BMW'],
      ['PistonHeads X3 M','Reviews','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('bmw-x3m', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','10,000 mi / 12 months','Due at 30,000 mi (1,500 mi away)',1],
      ['Brake Fluid','2 years','Due Mar 2027',0],
      ['Spark Plugs','30,000 mi','Due at 30,000 mi (1,500 mi away)',1],
      ['Transfer Case Fluid','40,000 mi','Due at 40,000 mi',0],
      ['Coolant','4 years','Due Mar 2025 — OVERDUE',1],
      ['Transmission Fluid','50,000 mi','Due at 50,000 mi',0],
    ]) insertService.run('bmw-x3m', item, intv, next, urg)
  }

  // =====================
  // 16. Mercedes-AMG GLC 63 S
  // Market: £34k-£74k, avg £48,000, 45 listings
  // =====================
  if (!carExists.get('mercedes-glc-63')) {
    insertCar.run('mercedes-glc-63','Mercedes-AMG GLC 63 S (X253)','Mercedes GLC 63 S',2020,44500,35000,
      'Obsidian Black Metallic','#0a0a0a','⚫',
      'AMG 4.0L V8 BiTurbo 510hp','510hp','516lb-ft','9-speed AMG MCT 4MATIC+','3.8s','155mph',
      'WDC2539792F123456',7.1,
      "V8 SUV bargain — a GLC 63 S for £44,500 was £95,000 new. The V8 BiTurbo in an SUV is an absurdity in the best possible way. 35k miles on a 2020. However: the same M177 engine bore scoring risk applies here. And the AMG MCT gearbox in a heavier SUV application has increased stress. Full AMG service history is MANDATORY — reject any car without it. The C63 AMG concerns are amplified by 200kg of extra weight. If condition checks out, this is a proper firebreathing super-SUV for the price of a VW Touareg. Go in with eyes open.",
      8380,0.6,6200,'Advisory')

    for (const [n,d,s] of [
      ['M177 Bore Scoring','Same critical risk as C63 — M177 V8 bore scoring from missed oil changes. Service history is the entire story here.','critical'],
      ['MCT Gearbox Wear (SUV)','The 9-speed MCT under SUV weight with spirited driving accumulates wear faster than in C63 saloon. £3,000-6,000 rebuild.','critical'],
      ['Airmatic Air Suspension','The GLC AMG rides on Airmatic — compressor and air bag failures are common with age. £800-2,500 per corner. Mandatory budget item.','high'],
      ['Catalytic Converter Theft','AMG SUV exhausts are prime theft targets. High ground clearance makes them easier to access than sports cars. Fit protection immediately.','high'],
      ['AdBlue Contamination Risk','SCR system contamination from wrong fluid can cause engine start lockout. Very expensive fix. Only ever use approved AdBlue.','high'],
      ['Rear Diff Wear','4MATIC+ rear diff under performance use wears faster. Listen for whine and clunk under load.','medium'],
      ['Brake Wear (Heavy SUV)','Performance brakes on 1,850kg+ SUV wear very quickly under spirited use. Budget for annual pad/disc inspection.','medium'],
    ] as [string,string,string][]) insertFault.run('mercedes-glc-63', n, d, s)

    for (const [d,r,mi,notes] of [
      ['May 2025','ADVISORY',35000,'Advisory: minor brake judder front near-side'],
      ['May 2024','PASS',22000,'Clean pass'],
      ['May 2023','PASS',10500,'Clean pass'],
    ]) insertMot.run('mercedes-glc-63', d, r, mi, notes)

    for (const [d,p] of [['Mar 20',95000],['Mar 21',85000],['Mar 22',75000],['Sep 22',65000],['Mar 23',58000],['Sep 23',51000],['Mar 24',46000]])
      insertPrice.run('mercedes-glc-63', d, p)

    for (const [d,mi] of [['Mar 20',0],['May 23',10500],['May 24',22000],['May 25',35000]])
      insertMileage.run('mercedes-glc-63', d, mi)

    for (const [n,p,f] of [
      ['AMG Driver Package (180mph)',3000,1],['Burmester Sound System',2800,1],['AMG Night Package',850,1],
      ['Panoramic Roof',1800,1],['360° Camera System',1200,1],['Rear Seat Comfort Pack',2200,1],
      ['Active Multi-Contour Seats',1600,0],
    ]) insertExtra.run('mercedes-glc-63', n, p, f)

    for (const [l,v] of [
      ['Make','Mercedes-AMG'],['Model','GLC 63 S 4MATIC+'],['Generation','X253 facelift'],['Engine Code','M177'],
      ['Displacement','3,982cc'],['Cylinders','V8 BiTurbo'],['Power','510hp @ 5,500rpm'],
      ['Torque','516lb-ft @ 1,750rpm'],['Gearbox','9-speed AMG Speedshift MCT'],['Drive','4MATIC+ AWD'],
      ['Kerb Weight','1,985kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','238 g/km'],['Body','5-door SUV'],
    ]) insertSpec.run('mercedes-glc-63', l, v)

    for (const [l,v,c] of [
      ['Insurance',2600,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',3600,'#f59e0b'],
      ['Servicing',1400,'#10b981'],['Tyres',1800,'#ef4444'],['AdBlue',300,'#06b6d4'],
    ]) insertCost.run('mercedes-glc-63', l, v, c)

    for (const [n,t,ic,u] of [
      ['MBWorld GLC AMG','Forum','💬','https://mbworld.org'],
      ['AMG Owners Club UK','Official','🏆','https://amgownersclub.co.uk'],
      ['GLC 63 Community','Facebook','📘','#'],
      ['r/AMG','Reddit','🤖','https://reddit.com/r/AMG'],
      ['PistonHeads GLC63','Reviews','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('mercedes-glc-63', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter (Fully Synthetic)','10,000 mi / 12 months','Due at 40,000 mi (5,000 mi away)',0],
      ['Brake Fluid','2 years','Due May 2025 — OVERDUE',1],
      ['MCT Transmission Fluid','30,000 mi','Due now — OVERDUE',1],
      ['Spark Plugs','40,000 mi','Due at 40,000 mi',0],
      ['Air Suspension Inspection','Annually','Inspect now — age-related risk',1],
      ['AdBlue','Every 5,000 mi','Check and top up',0],
    ]) insertService.run('mercedes-glc-63', item, intv, next, urg)
  }

  // =====================
  // 17. Lamborghini Urus
  // Market: £126k-£140k, avg £135,000, 195 listings
  // =====================
  if (!carExists.get('lamborghini-urus')) {
    insertCar.run('lamborghini-urus','Lamborghini Urus','Lamborghini Urus',2021,134500,18500,
      'Giallo Auge Pearl','#c8a800','🟡',
      '4.0L V8 BiTurbo 650hp','650hp','627lb-ft','8-speed ZF auto AWD','3.6s','190mph',
      'ZPBUA1ZL7MLA12345',7.3,
      "Ultra-luxury performance SUV — the Urus rewrote the supercar SUV rulebook. 650hp, sub-4-second 0-60, yet genuinely usable daily. At £134,500 with 18,500 miles, this is at the lower end of the market for a 2021. Giallo Auge is a bold choice that suits the car's character. The 4.0 V8 Biturbo is a modified version of the Porsche Cayenne engine — actually very reliable. The weak points are the electronics (constant Lamborghini dealer attention required) and the ceramic brake cost (£5k+/set). Ensure full Lamborghini main dealer service history. Running costs are significant — budget £15,000-20,000/year.",
      15000,-0.4,4500,'Clean')

    for (const [n,d,s] of [
      ['Ceramic Brake Wear','Carbon ceramic brakes are £4,000-6,000 per axle to replace. Proper bedding procedure required. Track use destroys them in one session.','critical'],
      ['Infotainment (MMI) Complexity','Three screens, multiple systems. Complex to use, prone to software freezes. Requires software updates via dealer.','medium'],
      ['Air Suspension Service Cost','Lamborghini-branded air suspension components cost multiples of equivalent Porsche parts. Budget £3,000-5,000 for any air susp. failure.','high'],
      ['Tyre Cost','265/35R22 front and 305/35R22 rear Pirelli P Zero tyres. £350-450 each. Full set £2,800-3,600.','high'],
      ['Dealer Service Costs','Full service at Lamborghini dealer: £2,500-4,000. No independent mechanic should touch this.','high'],
      ['Electronics Calibration','Multiple comfort/sport systems require regular software updates and calibration checks. Budget for annual dealer visit.','medium'],
      ['Exhaust Drone (Motorway)','At 70-80mph, exhaust resonance creates noticeable drone. Characteristic of V8 BiTurbo. Aftermarket systems worsen it.','low'],
    ] as [string,string,string][]) insertFault.run('lamborghini-urus', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Feb 2025','PASS',18500,'Clean pass — no advisories'],
      ['Feb 2024','PASS',11000,'Clean pass'],
    ]) insertMot.run('lamborghini-urus', d, r, mi, notes)

    for (const [d,p] of [['Mar 21',200000],['Sep 21',215000],['Mar 22',205000],['Sep 22',185000],['Mar 23',165000],['Sep 23',148000],['Mar 24',138000]])
      insertPrice.run('lamborghini-urus', d, p)

    for (const [d,mi] of [['Mar 21',0],['Feb 24',11000],['Feb 25',18500]])
      insertMileage.run('lamborghini-urus', d, mi)

    for (const [n,p,f] of [
      ['Q-Citura Stitching Interior',8500,1],['Lamborghini Telemetry System',4500,0],['Panoramic Sunroof',3200,1],
      ['Carbon Ceramic Brakes (CCM)',16000,1],['21" Taigete Wheels',0,1],
      ['Four Zone Climate',1800,1],['Night Vision Camera',2400,1],
    ]) insertExtra.run('lamborghini-urus', n, p, f)

    for (const [l,v] of [
      ['Make','Lamborghini'],['Model','Urus'],['Generation','Type LB736'],
      ['Engine','4.0L Twin-Turbo V8'],['Displacement','3,996cc'],['Power','650hp @ 6,000rpm'],
      ['Torque','627lb-ft @ 2,250rpm'],['Gearbox','ZF 8HP 8-speed auto'],['Drive','AWD (Torsen centre diff)'],
      ['Kerb Weight','2,200kg'],['Fuel','Super Plus (98 RON)'],['CO2','325 g/km'],['Body','5-door SUV'],
    ]) insertSpec.run('lamborghini-urus', l, v)

    for (const [l,v,c] of [
      ['Insurance',5500,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',5800,'#f59e0b'],
      ['Servicing',3500,'#10b981'],['Tyres',3200,'#ef4444'],
    ]) insertCost.run('lamborghini-urus', l, v, c)

    for (const [n,t,ic,u] of [
      ['LamborghiniTalk.com','Global Forum','💬','https://lamborghinitak.com'],
      ['Urus Owners Club','UK Owners','🏆','#'],
      ['r/Lamborghini','Reddit','🤖','https://reddit.com/r/Lamborghini'],
      ['PistonHeads Urus','UK Reviews','🗣️','https://pistonheads.com'],
      ['Lamborghini UK','Official','⭐','https://lamborghini.com/en-en'],
    ]) insertCommunity.run('lamborghini-urus', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter (Lamborghini Spec)','7,500 mi / 12 months','Due at 22,500 mi (4,000 mi away)',0],
      ['Brake Fluid','1 year','Due Feb 2026',0],
      ['Spark Plugs','30,000 mi','Due at 30,000 mi',0],
      ['Transmission Fluid (ZF)','50,000 mi','Due at 50,000 mi',0],
      ['Ceramics Inspection','Annually','Check brake disc thickness and delamination',1],
      ['Annual Software Calibration','Annually','Due at Lamborghini dealer',1],
    ]) insertService.run('lamborghini-urus', item, intv, next, urg)
  }

  // =====================
  // 18. Mercedes S-Class (W223)
  // Market: £58k-£168k, avg £79,000, 280 listings
  // =====================
  if (!carExists.get('mercedes-s-class')) {
    insertCar.run('mercedes-s-class','Mercedes S500 4MATIC (W223)','Mercedes S500',2021,82500,26000,
      'High-Tech Silver Metallic','#d0d5da','🥈',
      '3.0L Inline-6 EQ Boost 435hp MHEV','435hp','516lb-ft','9-speed 9G-Tronic','4.9s','155mph',
      'WDD2230731A123456',7.8,
      "The best car in the world, period. The W223 S-Class represents the absolute pinnacle of automotive technology. 4D chassis control, augmented reality navigation, rear-axle steering, 20-speaker Burmester, digital air suspension. At £82,500 with 26k miles, this is a phenomenal value for what it is — this car was £105,000+ new. The inline-6 EQ Boost mild hybrid is near-bulletproof reliability. Main concern: the complexity means any repair through a Mercedes dealer is eye-watering. Extended warranty is your friend here. For serious miles in supreme comfort, nothing comes close.",
      9480,-0.5,7000,'Clean')

    for (const [n,d,s] of [
      ['Air Suspension Complexity','4D active air suspension is miraculous in operation but complex in maintenance. Any failure requires main dealer attention. £1,500-4,000 depending on component.','high'],
      ['MBUX Infotainment Bugs','The W223 MBUX with up to 5 screens has frequent software glitches, screen freezes, and feature bugs. Over-the-air updates help but never fully resolved.','medium'],
      ['Electro-Hydraulic Rear Axle Steering','Rear-wheel steering system can develop faults. Warning light, reduced steering precision. £800-1,500 repair.','medium'],
      ['Windscreen Camera Calibration','Forward camera and radar system for ADAS requires calibration after any windscreen work. £300-500 extra on windscreen replacements.','medium'],
      ['48V System Complexity','The MHEV 48V system adds complexity. Mild hybrid battery packs have limited lifespan and are expensive.','medium'],
      ['Sunroof Seal Leaks','Panoramic roof seals can deteriorate allowing water ingress. Check headlining for any staining.','low'],
      ['Tyre Wear (Air Suspension Sport Mode)','Air suspension in Sport mode increases tyre wear significantly. Stick to Comfort for normal driving.','low'],
    ] as [string,string,string][]) insertFault.run('mercedes-s-class', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Mar 2025','PASS',26000,'Clean pass — no advisories'],
      ['Mar 2024','PASS',16500,'Clean pass'],
    ]) insertMot.run('mercedes-s-class', d, r, mi, notes)

    for (const [d,p] of [['Sep 21',108000],['Mar 22',105000],['Sep 22',99000],['Mar 23',93000],['Sep 23',88000],['Mar 24',85000],['Sep 24',83000]])
      insertPrice.run('mercedes-s-class', d, p)

    for (const [d,mi] of [['Sep 21',0],['Mar 24',16500],['Mar 25',26000]])
      insertMileage.run('mercedes-s-class', d, mi)

    for (const [n,p,f] of [
      ['Burmester 4D Surround Sound',8500,1],['First Class Rear Suite Package',9800,1],
      ['Executive Rear Seat Package',4500,1],['Augmented Reality Navigation',1200,1],
      ['Head-Up Display (Augmented)',1500,1],['Digital Light Headlights',2800,1],
      ['4-Zone Climate Control',0,1],
    ]) insertExtra.run('mercedes-s-class', n, p, f)

    for (const [l,v] of [
      ['Make','Mercedes-Benz'],['Model','S500 4MATIC'],['Generation','W223'],['Engine Code','M256 EQ Boost'],
      ['Displacement','2,999cc'],['Cylinders','Inline-6 + 48V MHEV'],['Power','435hp @ 5,900rpm'],
      ['Torque','516lb-ft @ 1,800rpm'],['Gearbox','9-speed 9G-Tronic'],['Drive','4MATIC AWD'],
      ['Kerb Weight','2,060kg'],['Fuel','Super Unleaded (95 RON)'],['CO2','209 g/km'],['Body','Long-wheelbase Saloon'],
    ]) insertSpec.run('mercedes-s-class', l, v)

    for (const [l,v,c] of [
      ['Insurance',2800,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',3000,'#f59e0b'],
      ['Servicing',1600,'#10b981'],['Tyres',1400,'#ef4444'],
    ]) insertCost.run('mercedes-s-class', l, v, c)

    for (const [n,t,ic,u] of [
      ['MBWorld S-Class','Global Forum','💬','https://mbworld.org'],
      ['Mercedes S-Class UK','UK Owners','🏴','#'],
      ['r/Mercedes_Benz','Reddit','🤖','https://reddit.com/r/Mercedes_Benz'],
      ['Benzworld S-Class','Forum','🌍','https://benzworld.org'],
      ['PistonHeads S500','UK Reviews','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('mercedes-s-class', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','15,000 mi / 12 months','Due at 30,000 mi (4,000 mi away)',0],
      ['Brake Fluid','2 years','Due Sep 2023 — OVERDUE',1],
      ['Transmission Fluid','60,000 mi','Due at 60,000 mi',0],
      ['Air Suspension Inspection','Annually','Check compressor and air bags now',0],
      ['Spark Plugs','40,000 mi','Due at 40,000 mi',0],
      ['48V System Health Check','3 years','Due Sep 2024 — OVERDUE',1],
    ]) insertService.run('mercedes-s-class', item, intv, next, urg)
  }

  // =====================
  // 19. BMW 7 Series 740i (G11/G70)
  // Market: £28k-£130k, avg £55,000, 481 listings
  // =====================
  if (!carExists.get('bmw-7-series')) {
    insertCar.run('bmw-7-series','BMW 740i M Sport (G11)','BMW 740i M Sport',2020,42500,32000,
      'Sophisto Grey Metallic','#5a6068','⬛',
      'B58 3.0L Turbo I6 335hp','335hp','368lb-ft','8-speed ZF auto','5.4s','155mph',
      'WBA7A2103LBJ12345',7.6,
      "Effortless luxury at used-car money — the G11 7 Series at £42,500 was £85,000+ new. The B58 engine is famously reliable (same unit powering the M340i, Z4, Supra). 32k miles on a 2020 is perfectly reasonable. M Sport spec adds the visual drama without the M Performance running costs. The G11 is the last 'simple' 7 Series before the G70 added more complexity. Laser lights, executive rear package, massage seats — real S-Class rival territory. Main concern: any air suspension issues are dealer-level repairs. Check brake service history — large car + four-wheel disc brakes wear tyres and pads fast.",
      7180,0.3,4500,'Clean')

    for (const [n,d,s] of [
      ['Air Suspension Failures','G11 with air suspension (standard spec) can develop compressor and bag failures. Dealer part prices are eye-watering.','high'],
      ['B58 Valve Cover Leak','Classic B58 issue — valve cover gasket seeping. Oil burning on manifold. Same fix as all B58 cars: £200-400.','medium'],
      ['ZF Gearbox Fluid Neglect','ZF 8HP marketed as "sealed for life" — it is not. Fluid change at 40k miles prevents £3,000 gearbox rebuild.','medium'],
      ['iDrive 7 Software Bugs','G11 iDrive 7 can freeze or have CarPlay connection drops. Software updates partially resolve. Newer G70 is significantly better.','low'],
      ['Rear Air Spring Leaks','Long-wheelbase rear air springs specifically susceptible. Watch for rear end sagging when parked overnight.','high'],
      ['Catalytic Converter Theft','Large BMW = target for cat thieves, especially in urban areas. Fit protection.','medium'],
      ['Tyre Wear (Wide Rear)','G11 750i/M Sport rides on 275-section rears. At £250-350 each, budget for frequent replacement.','medium'],
    ] as [string,string,string][]) insertFault.run('bmw-7-series', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Apr 2025','PASS',32000,'Clean pass'],
      ['Apr 2024','PASS',21000,'Clean pass'],
      ['Apr 2023','PASS',11500,'Clean pass'],
    ]) insertMot.run('bmw-7-series', d, r, mi, notes)

    for (const [d,p] of [['Mar 20',87000],['Sep 20',83000],['Mar 21',78000],['Sep 21',70000],['Mar 22',63000],['Mar 23',53000],['Mar 24',46000]])
      insertPrice.run('bmw-7-series', d, p)

    for (const [d,mi] of [['Mar 20',0],['Apr 23',11500],['Apr 24',21000],['Apr 25',32000]])
      insertMileage.run('bmw-7-series', d, mi)

    for (const [n,p,f] of [
      ['Bowers & Wilkins Diamond Sound',4500,1],['Executive Lounge Package',5800,1],
      ['Head-Up Display',1200,1],['Laser Lights',2200,1],['Heated/Ventilated Seats (Front)',1100,1],
      ['Rear Entertainment System',2400,1],['Massage Function',1800,1],
    ]) insertExtra.run('bmw-7-series', n, p, f)

    for (const [l,v] of [
      ['Make','BMW'],['Model','740i M Sport'],['Generation','G11 LCI'],['Engine Code','B58B30O1'],
      ['Displacement','2,998cc'],['Cylinders','Inline-6 Turbo'],['Power','335hp @ 5,500rpm'],
      ['Torque','368lb-ft @ 1,500rpm'],['Gearbox','ZF 8HP 8-speed auto'],['Drive','RWD'],
      ['Kerb Weight','1,870kg'],['Fuel','Super Unleaded (95 RON)'],['CO2','176 g/km'],['Body','Long-wheelbase Saloon'],
    ]) insertSpec.run('bmw-7-series', l, v)

    for (const [l,v,c] of [
      ['Insurance',2200,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',2800,'#f59e0b'],
      ['Servicing',1000,'#10b981'],['Tyres',1400,'#ef4444'],
    ]) insertCost.run('bmw-7-series', l, v, c)

    for (const [n,t,ic,u] of [
      ['BimmerPost G11','Global Forum','💬','https://g11.bimmerpost.com'],
      ['BMW 7 Series UK','UK Owners','🏴','#'],
      ['r/BMW','Reddit','🤖','https://reddit.com/r/BMW'],
      ['7series.net','Dedicated','🗣️','https://7series.net'],
      ['PistonHeads 740i','UK Reviews','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('bmw-7-series', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter','10,000 mi / 12 months','Due at 40,000 mi (8,000 mi away)',0],
      ['Brake Fluid','2 years','Due Apr 2025 — OVERDUE',1],
      ['ZF Transmission Fluid','40,000 mi','Due at 40,000 mi',0],
      ['Spark Plugs','40,000 mi','Due at 40,000 mi',0],
      ['Air Suspension Inspection','Annually','Check compressor health and bags',0],
      ['Coolant','4 years','Due Apr 2024 — OVERDUE',1],
    ]) insertService.run('bmw-7-series', item, intv, next, urg)
  }

  // =====================
  // 20. Audi RS6 Avant (C8)
  // Market: £63k-£100k, avg £78,000, 221 listings
  // =====================
  if (!carExists.get('audi-rs6-avant')) {
    insertCar.run('audi-rs6-avant','Audi RS6 Avant (C8)','Audi RS6 Avant',2021,79500,28500,
      'Nardo Grey','#7c7f83','⬛',
      '4.0 TFSI V8 BiTurbo 600hp MHEV','600hp','590lb-ft','8-speed tiptronic quattro','3.6s','155mph',
      'WAUZZZ4G9MN012345',8.4,
      "The ultimate family weapon — the RS6 Avant is the definitive car for people who need five seats, a massive boot, and genuine supercar performance. 600hp, quattro AWD, air suspension. At £79,500 with 28.5k miles on a 2021, this is at the lower end of the current market for a well-specced example. Nardo Grey is the hero colour for this car. The 4.0 V8 MHEV is a sensational engine — two cylinders deactivate on motorways for efficiency. The big cost concern is the 48V mild hybrid system and air suspension — any failure goes straight to a VAG main dealer. With full Audi service history, buy confidently.",
      10280,0.2,6500,'Clean')

    for (const [n,d,s] of [
      ['Air Suspension Failures (PDCC Air)','The RS6 rides on adjustable air suspension. Compressor, valve block, and air bag failures are the primary maintenance concern. £2,000-4,000 per event.','high'],
      ['48V MHEV System Complexity','The 48V mild hybrid battery and integrated starter-generator add significant complexity. Battery pack replacement is £2,000-4,000 when it fails.','high'],
      ['Cylinder Deactivation Issues','V8 cylinder deactivation (COD) can cause rough running or misfires if actuators stick. Software updates and quality oil help.','medium'],
      ['ZF Gearbox Fluid Neglect','Owners trust "lifetime" gearbox claim. Fluid change at 40k miles prevents progressive shift quality degradation.','medium'],
      ['Carbon Buildup (V8 TFSI)','Direct injection V8 — intake ports build carbon deposits. Walnut blast at 40-50k miles. Rough idle precedes this.','medium'],
      ['quattro Rear Differential','Under spirited use, the rear self-locking differential can develop whine. Regular fluid changes essential.','medium'],
      ['Exhaust Particulate Filter (OPF)','Petrol OPF on the RS6 requires active regeneration. City driving without highway runs leads to clogging. Can trigger limp mode.','medium'],
    ] as [string,string,string][]) insertFault.run('audi-rs6-avant', n, d, s)

    for (const [d,r,mi,notes] of [
      ['Feb 2025','PASS',28500,'Clean pass — no advisories'],
      ['Feb 2024','PASS',17000,'Clean pass'],
      ['Feb 2023','PASS',7500,'First MOT — clean pass'],
    ]) insertMot.run('audi-rs6-avant', d, r, mi, notes)

    for (const [d,p] of [['Mar 21',125000],['Sep 21',122000],['Mar 22',118000],['Sep 22',108000],['Mar 23',98000],['Sep 23',88000],['Mar 24',82000]])
      insertPrice.run('audi-rs6-avant', d, p)

    for (const [d,mi] of [['Mar 21',0],['Feb 23',7500],['Feb 24',17000],['Feb 25',28500]])
      insertMileage.run('audi-rs6-avant', d, mi)

    for (const [n,p,f] of [
      ['RS Dynamic Package Plus',4500,1],['Bang & Olufsen 3D Sound',4200,1],['Head-Up Display',1400,1],
      ['Panoramic Sunroof',1800,1],['RS Carbon Fibre Pack',3200,1],
      ['Matrix LED with Laser',2400,1],['RS Sport Exhaust',2800,1],
    ]) insertExtra.run('audi-rs6-avant', n, p, f)

    for (const [l,v] of [
      ['Make','Audi'],['Model','RS6 Avant'],['Generation','C8'],['Engine Code','DTEБ (4.0 TFSI)'],
      ['Displacement','3,996cc'],['Cylinders','V8 Twin-Turbo + 48V MHEV'],['Power','600hp @ 6,000rpm'],
      ['Torque','590lb-ft @ 2,050rpm'],['Gearbox','8-speed tiptronic'],['Drive','quattro AWD'],
      ['Kerb Weight','2,070kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','249 g/km'],['Body','Estate'],
    ]) insertSpec.run('audi-rs6-avant', l, v)

    for (const [l,v,c] of [
      ['Insurance',2800,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',4000,'#f59e0b'],
      ['Servicing',1500,'#10b981'],['Tyres',2200,'#ef4444'],
    ]) insertCost.run('audi-rs6-avant', l, v, c)

    for (const [n,t,ic,u] of [
      ['Audizine RS6','Global Forum','💬','https://audizine.com'],
      ['RS246.com','UK RS Club','🏎️','https://rs246.com'],
      ['Audi RS6 Owners UK','UK Club','🏴','#'],
      ['r/Audi','Reddit','🤖','https://reddit.com/r/Audi'],
      ['PistonHeads RS6','UK Reviews','🗣️','https://pistonheads.com'],
    ]) insertCommunity.run('audi-rs6-avant', n, t, ic, u)

    for (const [item,intv,next,urg] of [
      ['Engine Oil & Filter (5W-40 Full Syn)','9,300 mi / 12 months','Due at 30,000 mi (1,500 mi away)',1],
      ['Brake Fluid','2 years','Due Feb 2027',0],
      ['ZF Transmission Fluid','40,000 mi','Due at 40,000 mi',0],
      ['Spark Plugs','40,000 mi','Due at 40,000 mi',0],
      ['OPF Regen Drive','Monthly (20+ min highway)','Check if regularly driven on motorways',0],
      ['48V System Health Check','3 years','Due Feb 2024 — OVERDUE',1],
    ]) insertService.run('audi-rs6-avant', item, intv, next, urg)
  }

})

seedNewCars()
console.log('✅ CFO v5 — 20 additional cars seeded successfully!')
console.log('  Cars added:')
console.log('  1. volkswagen-golf-r')
console.log('  2. honda-civic-type-r')
console.log('  3. toyota-gr-yaris')
console.log('  4. hyundai-i30n')
console.log('  5. mercedes-amg-a45s')
console.log('  6. toyota-gr-supra')
console.log('  7. porsche-718-cayman')
console.log('  8. bmw-m2')
console.log('  9. audi-tt-rs')
console.log(' 10. mercedes-c63-amg')
console.log(' 11. bmw-m340i')
console.log(' 12. audi-s3')
console.log(' 13. alfa-romeo-giulia-qv')
console.log(' 14. porsche-macan')
console.log(' 15. bmw-x3m')
console.log(' 16. mercedes-glc-63')
console.log(' 17. lamborghini-urus')
console.log(' 18. mercedes-s-class')
console.log(' 19. bmw-7-series')
console.log(' 20. audi-rs6-avant')
db.close()