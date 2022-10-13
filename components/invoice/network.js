const express = require('express');
const response = require('../../network');
const controller = require('./controller');
const Helper = require('../../helpers');

const router = express.Router();

// middleware that is specific to this router
// router.use((req, res, next) => {
//   console.log('Time: ', Date.now());
//   next();
// });

const addInvoice = function (req, res) {
  const invoice = req.body;
  controller
    .addInvoice(invoice)
    .then(data => {
      response.success(req, res, data, 201);
    })
    .catch(err => {
      response.error(req, res, 'Internal error', 500, err);
    });
};

const lisInvoices = function (req, res) {
  const { invoiceId } = req.params;
  controller
    .listInvoices(invoiceId)
    .then(data => {
      response.success(req, res, data, 200);
    })
    .catch(err => {
      response.error(req, res, 'Internal error', 500, err);
    });
};

const updateInvoice = function (req, res) {
  const { invoiceId } = req.params;
  const invoice = req.body;
  const companyId = Helper.getCompanyId(req);
  invoice.companyId = companyId;
  controller
    .updateInvoice(invoiceId, invoice)
    .then(product => {
      response.success(req, res, product, 200);
    })
    .catch(err => {
      response.error(req, res, 'Internal error', 500, err);
    });
};

const removeInvoice = function (req, res) {
  const { invoiceId } = req.params;
  controller
    .removeInvoice(invoiceId)
    .then(data => {
      response.success(req, res, data, 200);
    })
    .catch(err => {
      response.error(req, res, 'Internal error', 500, err);
    });
};

const getImage = function (req, res) {
  const { path } = req.body;
  controller
    .getImage(path, res)
    .then(data => {
      response.success(req, res, data, 200);
    })
    .catch(err => {
      response.error(req, res, 'Internal error', 500, err);
    });
};

router.get('/', lisInvoices);
router.post('/image', getImage);
router.get('/:invoiceId', lisInvoices);
router.post('/', addInvoice);
router.patch('/:invoiceId', updateInvoice);
router.delete('/:invoiceId', removeInvoice);

module.exports = router;
