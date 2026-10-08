const postgres = require('postgres');

const sql = postgres('postgresql://postgres:RADHEsharma%40%23@db.vufnolnmqogciqhxhgln.supabase.co:5432/postgres');

async function main() {
  try {
    await sql`ALTER TABLE page_contents ADD COLUMN IF NOT EXISTS media_width VARCHAR(50)`;
    await sql`ALTER TABLE page_contents ADD COLUMN IF NOT EXISTS media_height VARCHAR(50)`;
    console.log('Columns added successfully');
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

main();
