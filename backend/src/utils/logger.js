function printBlock(title) {
  console.log('\n' + '═'.repeat(60));
  console.log(`📌 ${title}`);
  console.log('═'.repeat(60));
}

function normalizeRows(data) {
  if (!data) return null;
  return Array.isArray(data) ? data : [data];
}

function table(data) {
  const rows = normalizeRows(data);
  if (!rows || rows.length === 0) return;
  console.table(rows);
}

export function info(title, data = null) {
  printBlock(title);
  table(data);
}

export function success(message, data = null) {
  console.log(`✅ ${message}`);
  table(data);
}

export function warn(message, data = null) {
  console.log(`⚠️  ${message}`);
  table(data);
}

export function error(message, err = null) {
  console.log(`❌ ${message}`);
  if (err) console.log(err.message || err);
}

export function safeUser(row) {
  if (!row) return null;

  const copy = { ...row };
  delete copy.password;
  delete copy.password_hash;
  delete copy.codigo;
  delete copy.code;
  delete copy.token;
  delete copy.token_hash;
  delete copy.dev_code;
  delete copy.payload;

  return copy;
}

export default {
  info,
  success,
  warn,
  error,
  safeUser,
};
