const fs = require("fs");
const store = require('./store');

function addInvoice(invoice) {
  if (!invoice) {
    return Promise.reject(
      `invoice data is empty. invoice: ${invoice.toString()}`,
    );
  }

  return store.add(invoice);
}

function listInvoices(invoiceId, companyId) {
  return store.list(invoiceId, companyId);
}

function updateInvoice(invoiceId, invoice) {
  if (!invoiceId || !invoice) {
    return Promise.reject(
      `invoiceId or invoice is undefined. invoiceId is: ${invoiceId.toString()}, product is: ${JSON.stringify(
        invoice,
      )}`,
    );
  }
  return store.update(invoiceId, invoice);
}

function removeInvoice(invoiceId) {
  if (!invoiceId) {
    return Promise.reject('invoiceId is undefined');
  }
  return store.remove(invoiceId);
}

function getImage(path) {
  const base64 = fs.readFileSync(path, { encoding: 'base64' });
  return Promise.resolve(base64);
}

module.exports = {
  addInvoice,
  listInvoices,
  updateInvoice,
  removeInvoice,
  getImage
};
