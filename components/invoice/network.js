const express = require('express');
const response = require('../../network');
const controller = require('./controller');
const passportConfig = require('../../passport');
const Helper = require('../../helpers');

const router = express.Router();

// middleware that is specific to this router
// router.use((req, res, next) => {
//   console.log('Time: ', Date.now());
//   next();
// });

const addInvoice = function (req, res) {
  const invoice = req.body;
  const companyId = Helper.getCompanyId(req);
  const createdBy = Helper.getUserId(req);
  invoice.company = companyId;
  invoice.createdBy = createdBy;
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
  const companyId = Helper.getCompanyId(req);
  controller
    .listInvoices(invoiceId, companyId)
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

router.get('/', passportConfig.isAuth, lisInvoices);
router.get('/:invoiceId', passportConfig.isAuth, lisInvoices);
router.post('/', passportConfig.isAuth, addInvoice);
router.patch('/:invoiceId', passportConfig.isAuth, updateInvoice);
router.delete('/:invoiceId', passportConfig.isAuth, removeInvoice);

module.exports = router;
