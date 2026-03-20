import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = path.join(process.cwd(), 'data', 'cfo.db')
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Init schema
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

// Clear existing data
db.exec(`
  DELETE FROM service_schedule;
  DELETE FROM communities;
  DELETE FROM costs;
  DELETE FROM specs;
  DELETE FROM extras;
  DELETE FROM mileage_history;
  DELETE FROM price_history;
  DELETE FROM mot_history;
  DELETE FROM faults;
  DELETE FROM cars;
`)

const insertCar = db.prepare(`INSERT INTO cars VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
const insertFault = db.prepare(`INSERT INTO faults (carId,name,description,severity) VALUES (?,?,?,?)`)
const insertMot = db.prepare(`INSERT INTO mot_history (carId,date,result,mileage,notes) VALUES (?,?,?,?,?)`)
const insertPrice = db.prepare(`INSERT INTO price_history (carId,date,price) VALUES (?,?,?)`)
const insertMileage = db.prepare(`INSERT INTO mileage_history (carId,date,mileage) VALUES (?,?,?)`)
const insertExtra = db.prepare(`INSERT INTO extras (carId,name,price,fitted) VALUES (?,?,?,?)`)
const insertSpec = db.prepare(`INSERT INTO specs (carId,label,value) VALUES (?,?,?)`)
const insertCost = db.prepare(`INSERT INTO costs (carId,label,value,color) VALUES (?,?,?,?)`)
const insertCommunity = db.prepare(`INSERT INTO communities (carId,name,type,icon,url) VALUES (?,?,?,?,?)`)
const insertService = db.prepare(`INSERT INTO service_schedule (carId,item,interval,nextDue,urgent) VALUES (?,?,?,?,?)`)

const seedAll = db.transaction(() => {

  // =====================
  // BMW M4 Competition
  // =====================
  insertCar.run('m4','BMW M4 Competition (G82)','BMW M4 Comp',2021,52995,28400,'Isle of Man Green','#2d5a27','🟢',
    'S58 3.0L Twin-Turbo I6','510hp','479lb-ft','8-speed M Steptronic','3.9s','155mph',
    'WBS43AZ09N8B12345',7.8,
    "Good buy — priced £1,000 below current market average for spec and mileage. The slight oil leak advisory on the MOT is actually a negotiation lever — common on S58 engines and typically a £200-400 gasket fix. Low annual mileage suggests it hasn't been thrashed. Check service history for regular oil changes (critical for turbo longevity). Manual M4s don't exist, so resale is standard auto market. The G82 is now past its steepest depreciation curve.",
    8180,-1.8,3000,'Advisory')

  for (const f of [
    ['Crank Hub Failure Risk','S58 less affected than S55 predecessor, but the interference-fit pulley design remains. Monitor for timing-related codes. Aftermarket fix available ~£600.','medium'],
    ['Oil Leaks','Valve cover gaskets, oil filter housing gasket — most common leak points. Smell burning oil after spirited driving = rocker cover leak onto exhaust.','high'],
    ['Cooling System Complexity','Electronic water pump failures, thermostat issues. Coolant temp sensor failure causes gearbox to hold gears (thinks engine is cold).','high'],
    ['Auto Rough Shifting When Cold','ZF 8-speed can be jerky in first 5 minutes. Usually adapts but persistent issues may indicate fluid or mechatronic problems.','medium'],
    ['Excessive Brake Dust','Documented G-series M car defect. Stock pads produce enormous dust and squeal. Ceramic aftermarket pads (£200) solve it.','low'],
    ['Rear Differential Noise','Clunking or whining under load changes. Check diff mount bushings and fluid level.','medium'],
    ['Infotainment Freezing','iDrive 8 can freeze or lag. Software updates usually resolve. Check current software version.','low'],
    ['A/C Pressure Sensor Failures','Condenser leaks and pressure sensor faults common. Test A/C thoroughly on viewing.','medium'],
  ]) insertFault.run('m4', f[0], f[1], f[2])

  for (const m of [
    ['Mar 2025','PASS',28400,'Advisory: slight oil leak front subframe area'],
    ['Mar 2024','PASS',22800,'Clean pass — no advisories'],
    ['Mar 2023','PASS',18100,'First MOT — clean pass'],
  ]) insertMot.run('m4', m[0], m[1], m[2], m[3])

  for (const [d,p] of [['Mar 22',72000],['Sep 22',68500],['Mar 23',63000],['Sep 23',58500],['Mar 24',55000],['Sep 24',53500],['Mar 25',52000]])
    insertPrice.run('m4', d, p)

  for (const [d,mi] of [['Mar 21',0],['Mar 22',9200],['Mar 23',18100],['Mar 24',22800],['Mar 25',28400]])
    insertMileage.run('m4', d, mi)

  for (const [n,p,f] of [
    ['M Carbon Bucket Seats',4500,1],['Carbon Ceramic Brakes',7900,0],['M Carbon Exterior Package',2200,1],
    ['Harman Kardon Surround',850,1],['Laser Lights',1500,1],['Head-Up Display',1100,1],
    ["M Driver's Package (155→180mph)",2500,0]
  ]) insertExtra.run('m4', n, p, f)

  for (const [l,v] of [
    ['Make','BMW'],['Model','M4 Competition'],['Generation','G82'],['Engine Code','S58B30'],
    ['Displacement','2,993cc'],['Cylinders','Straight-6 Twin-Turbo'],['Power','510hp @ 6,250rpm'],
    ['Torque','479lb-ft @ 2,750rpm'],['Gearbox','ZF 8HP 8-speed auto'],['Drive','RWD'],
    ['Kerb Weight','1,725kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','227 g/km'],
    ['Euro NCAP','N/A (not tested)']
  ]) insertSpec.run('m4', l, v)

  for (const [l,v,c] of [
    ['Insurance',2200,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',3400,'#f59e0b'],
    ['Servicing',800,'#10b981'],['Tyres',1200,'#ef4444']
  ]) insertCost.run('m4', l, v, c)

  for (const [n,t,ic,u] of [
    ['BimmerPost G82','Enthusiast Forum','💬','https://g82.bimmerpost.com'],
    ['BMW M Owners Club UK','Official Club','🏴󠁧󠁢󠁥󠁮󠁧󠁿','#'],
    ['M4Talk.com','Dedicated Forum','🗣️','#'],
    ['r/BMW','Reddit Community','🤖','https://reddit.com/r/BMW'],
    ['BimmerFest','Event & Forum','🎉','https://bimmerfest.com']
  ]) insertCommunity.run('m4', n, t, ic, u)

  for (const [item,intv,next,urg] of [
    ['Engine Oil & Filter','10,000 mi / 12 months','Due at 30,000 mi (1,600 mi away)',1],
    ['Brake Fluid','2 years','Due Mar 2027',0],
    ['Spark Plugs','30,000 mi','Due at 30,000 mi (1,600 mi away)',1],
    ['Transmission Fluid','50,000 mi','Due at 50,000 mi',0],
    ['Coolant','4 years','Due Mar 2025 — OVERDUE',1]
  ]) insertService.run('m4', item, intv, next, urg)

  // =====================
  // BMW M3 Competition
  // =====================
  insertCar.run('m3','BMW M3 Competition (G80)','BMW M3 Comp 6MT',2022,54750,19200,'Brooklyn Grey','#8a8d93','⚫',
    'S58 3.0L Twin-Turbo I6','510hp','479lb-ft','6-speed Manual','4.2s','155mph',
    'WBA53EZ05N8C67890',8.2,
    "Excellent buy — the 6-speed manual M3 Competition is already a modern classic. Manual take rate was only ~15%, making these genuinely rare. Low 19,200 miles, completely clean MOT. Brooklyn Grey is one of the most desirable colours. These are APPRECIATING in some markets. The premium over the auto M4 is justified by collectability. Only concern: verify clutch hasn't been abused (check pedal feel and bite point).",
    8180,1.4,2000,'Clean')

  for (const [n,d,s] of [
    ['Clutch Wear (Manual)','Manual gearbox clutch can wear under aggressive driving or repeated launches. OEM replacement ~£1,800. Check pedal feel and bite point.','high'],
    ['Excessive Brake Dust & Squeal','Documented defect across all G-series M cars. Dust coats wheels within 15 miles. Aftermarket ceramic pads recommended.','medium'],
    ['Steering Alignment from Factory','Multiple G80 owners report slight pull or off-centre wheel from new. Check alignment — may need dealer recalibration.','medium'],
    ['Interior Rattles','Rear seat and trunk area rattles reported. Trunk seal and wireless charger tray common sources.','low'],
    ['Headlight Condensation','Early production recall for headlight grommet replacement to improve ventilation. Check if recall completed.','low'],
    ['Door Seal Creaking','Weather-dependent creaking from door seals. Gummi Pflege treatment helps. Common across F8x and G8x.','low'],
    ['Brake Shield Stone Trapping','Stones get trapped between brake disc and heat shield causing grinding noise. Easily cleared but annoying.','low'],
    ['S58 Engine Faults','Same oil leak, cooling, and crank hub considerations as M4. See M4 fault list for details.','medium'],
  ]) insertFault.run('m3', n, d, s)

  insertMot.run('m3','Feb 2025','PASS',19200,'Clean pass — no advisories')

  for (const [d,p] of [['Jun 22',75500],['Dec 22',71000],['Jun 23',65000],['Dec 23',60500],['Jun 24',57000],['Dec 24',55500],['Mar 25',54000]])
    insertPrice.run('m3', d, p)

  for (const [d,mi] of [['Jun 22',0],['Feb 24',8500],['Feb 25',19200]])
    insertMileage.run('m3', d, mi)

  for (const [n,p,f] of [
    ['6-Speed Manual',0,1],['M Carbon Bucket Seats',4500,0],['Carbon Ceramic Brakes',7900,0],
    ['Visibility Package',1200,1],['M Pro Package (180mph)',2500,1]
  ]) insertExtra.run('m3', n, p, f)

  for (const [l,v] of [
    ['Make','BMW'],['Model','M3 Competition'],['Generation','G80'],['Engine Code','S58B30'],
    ['Displacement','2,993cc'],['Cylinders','Straight-6 Twin-Turbo'],['Power','510hp @ 6,250rpm'],
    ['Torque','479lb-ft @ 2,750rpm'],['Gearbox','6-speed Manual'],['Drive','RWD'],
    ['Kerb Weight','1,730kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','234 g/km'],['Doors','4 (Saloon)']
  ]) insertSpec.run('m3', l, v)

  for (const [l,v,c] of [
    ['Insurance',2100,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',3600,'#f59e0b'],
    ['Servicing',800,'#10b981'],['Tyres',1100,'#ef4444']
  ]) insertCost.run('m3', l, v, c)

  for (const [n,t,ic,u] of [
    ['BimmerPost G80','Enthusiast Forum','💬','https://g80.bimmerpost.com'],
    ['BMW M3 Forum UK','UK Owners','🏴󠁧󠁢󠁥󠁮󠁧󠁿','#'],
    ['r/F80','Reddit','🤖','https://reddit.com/r/F80'],
    ['M3Post.com','Dedicated Forum','🗣️','https://m3post.com']
  ]) insertCommunity.run('m3', n, t, ic, u)

  for (const [item,intv,next,urg] of [
    ['Engine Oil & Filter','10,000 mi / 12 months','Due at 20,000 mi (800 mi away)',1],
    ['Brake Fluid','2 years','Due Jun 2024 — OVERDUE',1],
    ['Spark Plugs','30,000 mi','Due at 30,000 mi',0],
    ['Clutch Inspection','15,000 mi (manual)','Check at next service',0],
    ['Coolant','4 years','Due Jun 2026',0]
  ]) insertService.run('m3', item, intv, next, urg)

  // =====================
  // Audi RS3
  // =====================
  insertCar.run('rs3','Audi RS3 Sportback (8Y)','Audi RS3',2022,44995,22100,'Nardo Grey','#7c7f83','🔘',
    'DAZA 2.5L Turbo 5-Cyl','400hp','369lb-ft','7-speed S tronic DSG','3.8s','155mph',
    'WUAXXXF45NA123456',7.2,
    "Decent deal with negotiation room — the brake disc advisory is your leverage for at least £500-1,000 off. The 5-cylinder sound is intoxicating and these are rapid in a straight line. However, the 8Y has some concerning known issues: DSG whine and overheating reports, and injector failures can be catastrophic. Get a pre-purchase inspection focusing on DSG health. Haldex service history is critical. Lowest running costs in this watchlist.",
    6880,1.1,2500,'Advisory')

  for (const [n,d,s] of [
    ['Injector Failures','Can cause CATASTROPHIC engine damage. The 5-cyl closed-loop control masks failing injectors. Replace preventatively at high mileage. Genuine Audi only — fakes destroy engines.','critical'],
    ['DSG Transmission Whine','Known 8Y issue — high-pitched whine on cold starts, increases with RPM. Linked to DSG pump or cooling system. Can progress to full transmission failure.','critical'],
    ['Transmission Overheating','Overheating warnings reported even in cold weather during light driving. May indicate failing DSG pump or coolant flange defect.','high'],
    ['Carbon Buildup on Intake','Direct injection = no fuel wash over valves. Walnut blast cleaning needed at 30,000 miles. Reduced throttle response, rough idle.','high'],
    ['Mechatronic Unit Failures','DSG brain unit can fail. £2,000+ repair. Check for any hesitation or odd shifting patterns.','high'],
    ['Oil Consumption','Higher than average, especially under spirited driving. PCV system faults lead to blow-by. Monitor oil level between services.','medium'],
    ['Haldex AWD Coupling','Needs fluid change every 20,000 mi. Neglect = reduced rear traction, unusual noises, front-wheel-drive only default.','medium'],
    ['Turbo Wastegate Issues','Under high stress or with tunes. Loss of boost, poor acceleration, check engine light.','medium'],
    ['Seat Leather Creasing','8Y RS3 seats develop premature creases. Cosmetic only but common complaint.','low'],
  ]) insertFault.run('rs3', n, d, s)

  for (const [d,r,mi,notes] of [
    ['Jan 2025','PASS',22100,'Advisory: front brake disc worn close to limit'],
    ['Jan 2024','PASS',11400,'Clean pass']
  ]) insertMot.run('rs3', d, r, mi, notes)

  for (const [d,p] of [['Mar 22',58000],['Sep 22',55500],['Mar 23',51000],['Sep 23',48500],['Mar 24',47000],['Sep 24',45500],['Mar 25',44500]])
    insertPrice.run('rs3', d, p)

  for (const [d,mi] of [['Mar 22',0],['Jan 24',11400],['Jan 25',22100]])
    insertMileage.run('rs3', d, mi)

  for (const [n,p,f] of [
    ['RS Dynamic Package',3000,1],['RS Design Package (red stitch)',1500,0],['B&O Sound System',1200,1],
    ['Matrix LED Headlights',1800,1],['Panoramic Sunroof',1200,0],['RS Sport Exhaust',1000,1]
  ]) insertExtra.run('rs3', n, p, f)

  for (const [l,v] of [
    ['Make','Audi'],['Model','RS3 Sportback'],['Generation','8Y'],['Engine Code','DAZA'],
    ['Displacement','2,480cc'],['Cylinders','Inline-5 Turbo'],['Power','400hp @ 5,600rpm'],
    ['Torque','369lb-ft @ 2,250rpm'],['Gearbox','7-speed S tronic DSG'],['Drive','quattro AWD'],
    ['Kerb Weight','1,570kg'],['Fuel','Super Unleaded (98 RON)'],['CO2','209 g/km'],['Body','5-door Sportback']
  ]) insertSpec.run('rs3', l, v)

  for (const [l,v,c] of [
    ['Insurance',1900,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',2800,'#f59e0b'],
    ['Servicing',700,'#10b981'],['Tyres',900,'#ef4444']
  ]) insertCost.run('rs3', l, v, c)

  for (const [n,t,ic,u] of [
    ['Audizine RS3','Enthusiast Forum','💬','https://audizine.com'],
    ['RS246.com','Audi RS Forum','🏎️','https://rs246.com'],
    ['Audi Sport UK','UK Club','🏴󠁧󠁢󠁥󠁮󠁧󠁿','#'],
    ['r/Audi_RS3','Reddit','🤖','https://reddit.com/r/Audi_RS3'],
    ['RS3 Owners Club UK','Owners Club','🤝','#']
  ]) insertCommunity.run('rs3', n, t, ic, u)

  for (const [item,intv,next,urg] of [
    ['Engine Oil & Filter','9,300 mi / 12 months','Due now — at 22,100 mi',1],
    ['Brake Fluid','2 years','Due Mar 2024 — OVERDUE',1],
    ['DSG Fluid & Filter','40,000 mi','Due at 40,000 mi',0],
    ['Haldex Fluid','20,000 mi','Due at 20,000 mi — OVERDUE',1],
    ['Walnut Blast Intake Clean','30,000 mi','Due at 30,000 mi (7,900 mi)',0],
    ['Spark Plugs','40,000 mi','Due at 40,000 mi',0]
  ]) insertService.run('rs3', item, intv, next, urg)

  // =====================
  // Porsche 911 Carrera S
  // =====================
  insertCar.run('911','Porsche 911 Carrera S (992)','Porsche 911 S',2020,84995,31500,'GT Silver Metallic','#c0c0c0','🥈',
    '3.0L Twin-Turbo Flat-6','450hp','390lb-ft','8-speed PDK','3.5s','191mph',
    'WP0AB2A99LS234567',8.5,
    "Best deal in the watchlist — this 992 Carrera S ticks every box. Three clean MOTs with consistent mileage (10k/year = healthy driver). GT Silver is a classic Porsche colour. Values have stabilised after the post-pandemic correction — the 992 has likely found its floor. Two things to check: ask specifically about the Bose door speakers (extremely common failure) and whether the fuel injector TSB has been addressed. At £85k, you're getting a car that was £105k new with proven reliability.",
    9180,-0.6,3500,'Clean')

  for (const [n,d,s] of [
    ['Bose Speaker Failures','EXTREMELY common on 992. Door speakers blow at moderate volumes. Both sides affected. Replacement ~£300/speaker but recurring issue.','high'],
    ['Fuel Injector Issues','Technical Service Bulletin exists for certain VINs. Check engine light, misfires, rough running. Covered under warranty/TSB if applicable.','high'],
    ['Engine Oil Leaks','Seals and gaskets degrade over time. Check for oil spots, reduced oil level between services.','medium'],
    ['Cooling System Leaks','Hoses and seals can weep. Monitor coolant level. Overheating risk if ignored.','medium'],
    ['PDK Rough Shifting','Occasional hesitation or jerkiness in low-speed manoeuvring. Software update may help.','low'],
    ['Lift System Errors','Front axle lift intermittently fails or shows errors. Requires engine restart to clear. Annoying but not dangerous.','low'],
    ['PCM Infotainment Glitches','Occasional freezing or lag. Software updates from Porsche resolve most issues.','low'],
    ['Carbon Buildup','Direct injection engine — intake valve carbon deposits over time. Less aggressive than VAG 5-cyl but monitor.','medium'],
    ['Brake Wear with Track Use','If car has been tracked, pads and discs wear fast. Check disc thickness and pad life.','medium'],
  ]) insertFault.run('911', n, d, s)

  for (const [d,r,mi,notes] of [
    ['Nov 2024','PASS',31500,'Clean pass'],
    ['Nov 2023','PASS',21800,'Advisory: front tyre close to limit'],
    ['Nov 2022','PASS',10200,'Clean pass']
  ]) insertMot.run('911', d, r, mi, notes)

  for (const [d,p] of [['Mar 20',105000],['Mar 21',115000],['Mar 22',110000],['Mar 23',99000],['Mar 24',90000],['Sep 24',87000],['Mar 25',84500]])
    insertPrice.run('911', d, p)

  for (const [d,mi] of [['Mar 20',0],['Nov 22',10200],['Nov 23',21800],['Nov 24',31500]])
    insertMileage.run('911', d, mi)

  for (const [n,p,f] of [
    ['Sport Chrono Package',1900,1],['PASM Sport Suspension -10mm',1200,1],['LED Matrix Headlights',2100,1],
    ['Bose Surround Sound',1000,1],['Sport Exhaust',2400,1],['Rear Axle Steering',1800,1],
    ['PDCC (Dynamic Chassis)',3400,0],['18-way Adaptive Sport Seats',3200,1]
  ]) insertExtra.run('911', n, p, f)

  for (const [l,v] of [
    ['Make','Porsche'],['Model','911 Carrera S'],['Generation','992.1'],
    ['Engine','Twin-Turbo Flat-6'],['Displacement','2,981cc'],['Power','450hp @ 6,500rpm'],
    ['Torque','390lb-ft @ 2,300rpm'],['Gearbox','8-speed PDK'],['Drive','RWD'],
    ['Kerb Weight','1,515kg'],['Fuel','Super Plus (98 RON)'],['CO2','206 g/km'],['Body','Coupe']
  ]) insertSpec.run('911', l, v)

  for (const [l,v,c] of [
    ['Insurance',2800,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',3200,'#f59e0b'],
    ['Servicing',1200,'#10b981'],['Tyres',1400,'#ef4444']
  ]) insertCost.run('911', l, v, c)

  for (const [n,t,ic,u] of [
    ['PistonHeads 992','UK Forum','💬','https://pistonheads.com'],
    ['Porsche Club GB','Official Club','🏆','https://porscheclubgb.com'],
    ['911UK.com','UK Specialist','🏴󠁧󠁢󠁥󠁮󠁧󠁿','https://911uk.com'],
    ['Rennlist 992','Global Forum','🌍','https://rennlist.com'],
    ['r/Porsche','Reddit','🤖','https://reddit.com/r/Porsche']
  ]) insertCommunity.run('911', n, t, ic, u)

  for (const [item,intv,next,urg] of [
    ['Engine Oil & Filter','10,000 mi / 12 months','Due at 40,000 mi (8,500 mi)',0],
    ['Brake Fluid','2 years','Due Nov 2026',0],
    ['Spark Plugs','40,000 mi','Due at 40,000 mi (8,500 mi)',0],
    ['PDK Fluid','40,000 mi','Due at 40,000 mi',0],
    ['Coolant','4 years','Due Mar 2024 — OVERDUE',1],
    ['Air Filter','30,000 mi','Due at 30,000 mi — OVERDUE',1]
  ]) insertService.run('911', item, intv, next, urg)

  // =====================
  // Range Rover D350
  // =====================
  insertCar.run('rr','Range Rover D350 (L460)','Range Rover D350',2022,89995,26800,'Carpathian Grey','#4a4e54','⬛',
    '3.0L Ingenium Turbo Diesel I6 MHEV','350hp','516lb-ft','8-speed ZF auto','5.8s','145mph',
    'SALGS5SE5NA345678',6.8,
    "Proceed with caution — the L460 is a stunning machine but the air spring advisory is a yellow flag. Air suspension repairs run £800-2,500 per corner. Depreciation is the real killer here: this car has lost nearly £40,000 in 2.5 years. The 3.0 Ingenium diesel has had crankshaft quality issues in some batches — verify the batch number with a JLR dealer. Get a FULL dealer service history and battery health check (electrical gremlins are voltage-dependent). Beautiful car, but the total cost of ownership is eye-watering.",
    8380,1.1,8000,'Advisory')

  for (const [n,d,s] of [
    ['Air Suspension Failures','Bags crack, compressors fail, valves leak. £800-2,500 per corner. Entire system overhaul £4,500+. THE most expensive RR issue.','critical'],
    ['Crankshaft Quality Issues','3.0L diesel had bad casting tolerances in some batches. Oil starvation → bearing failure → snapped crank. Verify batch number.','critical'],
    ['Electrical Gremlins','Phantom warnings, infotainment crashes, terrain response failures, battery drain. Often caused by low battery voltage — charge battery first before chasing faults.','high'],
    ['Alternator Failures','Triggers 1-hour system shutdown + kills AGM battery. Need new alternator AND battery. ~£1,500 combined.','high'],
    ['DPF Clogging','Short trips and city driving clog the diesel particulate filter. Need monthly 30+ min highway runs for regeneration.','medium'],
    ['ZF Gearbox Sluggish','Without regular fluid changes, shifts become slow and sloppy. 3-4 second delay drive-to-reverse reported on neglected cars.','medium'],
    ['A/C Refrigerant Leaks','Copper/alloy pipe corrosion causes leaks. No cold air. Requires pipe replacement.','medium'],
    ['Transfer Case Service','Haldex-style transfer case needs servicing every 40,000 mi. Neglect = reduced capability.','medium'],
    ['Interior Rattles','Suspension height changes cause bangs and clunks. Interior trim rattles widely reported.','low'],
    ['Soft-Close Door Failures','Mechanism can malfunction. Doors don\'t fully close or close too aggressively.','low'],
    ['Door Lock Malfunctions','Keyless entry and tailgate can be intermittent. Faulty actuators or wiring.','low'],
  ]) insertFault.run('rr', n, d, s)

  for (const [d,r,mi,notes] of [
    ['Apr 2025','PASS',26800,'Advisory: n/s rear air spring showing age cracks'],
    ['Apr 2024','PASS',14200,'Clean pass']
  ]) insertMot.run('rr', d, r, mi, notes)

  for (const [d,p] of [['Sep 22',128000],['Mar 23',118000],['Sep 23',108000],['Mar 24',99000],['Sep 24',93000],['Mar 25',89000]])
    insertPrice.run('rr', d, p)

  for (const [d,mi] of [['Sep 22',0],['Apr 24',14200],['Apr 25',26800]])
    insertMileage.run('rr', d, mi)

  for (const [n,p,f] of [
    ['Rear Executive Class Seats',5200,1],['Meridian Signature Sound',4800,1],['Head-Up Display',1300,1],
    ['Pixel LED Headlights',2200,1],['Rear Seat Entertainment',2500,0],['All-Terrain Tyre Pack',600,0],
    ['Tow Bar Prep',550,1]
  ]) insertExtra.run('rr', n, p, f)

  for (const [l,v] of [
    ['Make','Land Rover'],['Model','Range Rover D350'],['Generation','L460'],
    ['Engine','3.0L Ingenium I6 Turbo Diesel'],['Hybrid','48V MHEV'],['Displacement','2,997cc'],
    ['Power','350hp @ 4,000rpm'],['Torque','516lb-ft @ 1,500rpm'],['Gearbox','ZF 8HP 8-speed auto'],
    ['Drive','AWD + 2-speed Transfer Case'],['Kerb Weight','2,505kg'],['Fuel','Diesel'],
    ['CO2','217 g/km'],['Towing','3,500kg']
  ]) insertSpec.run('rr', l, v)

  for (const [l,v,c] of [
    ['Insurance',2400,'#3b82f6'],['Road Tax',580,'#8b5cf6'],['Fuel',2600,'#f59e0b'],
    ['Servicing',1000,'#10b981'],['Tyres',1600,'#ef4444'],['AdBlue',200,'#06b6d4']
  ]) insertCost.run('rr', l, v, c)

  for (const [n,t,ic,u] of [
    ['FullFatRR.com','Specialist Forum','💬','https://fullfatrr.com'],
    ['Range Rover Forum UK','UK Owners','🏴󠁧󠁢󠁥󠁮󠁧󠁿','#'],
    ['LandyZone','Land Rover Forum','🌍','https://landyzone.co.uk'],
    ['PistonHeads RR','Discussion','🗣️','https://pistonheads.com'],
    ['r/RangeRover','Reddit','🤖','https://reddit.com/r/RangeRover']
  ]) insertCommunity.run('rr', n, t, ic, u)

  for (const [item,intv,next,urg] of [
    ['Engine Oil & Filter','10,000 mi / 12 months','Due at 30,000 mi (3,200 mi)',0],
    ['Brake Fluid','2 years','Due Sep 2024 — OVERDUE',1],
    ['DPF Regen Drive','Monthly (30+ min highway)','Check if driven regularly',1],
    ['Transmission Fluid','40,000 mi','Due at 40,000 mi',0],
    ['Transfer Case Fluid','40,000 mi','Due at 40,000 mi',0],
    ['Air Suspension Inspection','Annually','URGENT — cracks found at MOT',1],
    ['AdBlue Top-Up','Every 6,000 mi','Check level now',0]
  ]) insertService.run('rr', item, intv, next, urg)

})

seedAll()
console.log('✅ CFO v5 database seeded successfully!')
console.log('  - 5 cars')
console.log('  - Faults, MOT history, price/mileage charts, specs, extras, costs, communities, service schedules')
db.close()
