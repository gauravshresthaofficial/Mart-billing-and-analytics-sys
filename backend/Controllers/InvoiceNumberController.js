const InvoiceNumber = require('../Models/InvoiceNumberModel');

// Function to generate a unique invoice number based on the last used invoice number
async function generateInvoiceNumber(req, res) {
    try {
      // Retrieve the last invoice number document from the database
      let invoiceNumberDoc = await InvoiceNumber.findOne();
      
      // If no document is found, create a new one with a default value
      if (!invoiceNumberDoc) {
        // Generate a random invoice number
        const randomInvoiceNumber = generateRandomInvoiceNumber();
        const newInvoiceNumberDoc = new InvoiceNumber({ invoiceNumber: randomInvoiceNumber });
        invoiceNumberDoc = await newInvoiceNumberDoc.save();
      }
  
      // Retrieve the last invoice number from the document
      const invoiceNumber = invoiceNumberDoc.invoiceNumber;
  
      // Logic to generate a unique invoice number, such as incrementing the last used invoice number
      const sequentialNumber = parseInt(invoiceNumber.substring(4)) + 1; // Assuming 'INV-' is the prefix
      const newInvoiceNumber = `INV-${sequentialNumber.toString().padStart(4, '0')}`;
      
      // Send the new invoice number in the response
      res.json(newInvoiceNumber);
    } catch (error) {
      console.error('Error generating invoice number:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

// Function to generate a random invoice number
function generateRandomInvoiceNumber() {
    const randomNum = Math.floor(Math.random() * 9999) + 1;
    return `INV-${randomNum.toString().padStart(4, '0')}`;
}

// Function to update the last used invoice number in the database
async function updateInvoiceNumber(req, res) {
    try {
      console.log(req.body, "In controller")
      const {newInvoiceNumber} = req.body;
  
      // Retrieve the last invoice number document from the database
      let invoiceNumberDoc = await InvoiceNumber.findOne();
  
      // If no document is found, create a new one with the provided invoice number
      if (!invoiceNumberDoc) {
        const newInvoiceNumberDoc = new InvoiceNumber({ invoiceNumber: newInvoiceNumber });
        invoiceNumberDoc = await newInvoiceNumberDoc.save();
      } else {
        // Update the last invoice number in the existing document
        invoiceNumberDoc.invoiceNumber = newInvoiceNumber;
        await invoiceNumberDoc.save();
      }
  
      res.json({ message: 'Last invoice number updated successfully' });
    } catch (error) {
      console.error('Error updating last invoice number:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
  generateInvoiceNumber,
  updateInvoiceNumber
};
