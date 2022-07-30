# Rules for the smart contract construct

In our approach we consider 3 interacting objects:
- Brand or Creator (product creating brands like Nike, Apple, etc.)
- Retailer or Approver (retailers like Flipkart, Amazon, etc.)
- Customers or Owners (the buyers who buy and then own the products sold by the above two)

---

Step 1: 

Creator creates a product. Creator would mint a NFT associated with that product if there 
is a warranty to be issued. At this stage, the mint contains the details about the product 
such as ISN, creator’s address on blockchain, the URL containing the warranty terms and 
conditions uploaded in IPFS, and other essential details such as number of available 
transfer for the customer, etc. Multiple minting feature is available, where the creator 
can mint multiple tokens in a single transaction. 

---

Step 2:

The Creator may approve a Retailer for his product. Note that there can only be one 
approved Retailer for a single product. The Creator may also not have any Approver for the 
product if he plans on selling them on his own.

---

Step 3:

A Customer then buys the product, either directly from the Creator or the Approver/Retailer. 
At this stage, the timestamp field is activated when a Creator or Approver transfers the item 
to a Customer, which indicates that the warranty period has started.

---

Step 4:

If there is any repair for the product, and the warranty is valid, then when the 
Creator/Approver resolves the repair request, it would get stored as item history. Similarly, 
if a replace were to occur, the old item would be burnt/decayed and the new item with a 
different token id replaces the item.

---

Step 5:

If transfer is allowed by the Creator specified at mint time, the current owner, can transfer 
the token to another. The allowed number of transfers can be controlled by the Creator or 
Approver.

---

Step 6:

If the warranty period is over, the token can be burnt/decayed which wipes away the item 
information.

---

Step 7:

If the warranty is to be extended, Creator has the rights to set the Period property of the 
token. The Retailer too, can issue his own version of the warranty of the Creator’s product
by minting a new token.