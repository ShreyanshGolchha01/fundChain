# Center of Excellence (COE) Project Report

**Project Title:** ChainFund — Smart Crowdfunding System using Blockchain  
**Team Members:** [Student Name(s)]  
**Institution:** [College Name]  

---

## 1. Executive Summary

Crowdfunding has revolutionized the way startups, charities, and creators raise capital. However, traditional platforms suffer from a centralized trust model resulting in high fees, lack of transparency, and delayed fund disbursements. **ChainFund** is a minimum viable product (MVP) demonstrating a decentralized approach to crowdfunding. By implementing a simulated blockchain ledger and smart-contract logic, ChainFund ensures that all transactions are transparent, mathematically linked, and immutable. It enforces strict funding rules (goal-based payouts and deadline-based refunds) without human intervention, solving the core issues of traditional crowdfunding platforms.

## 2. Problem Statement

Modern centralized crowdfunding platforms face several critical issues:
* **Centralization & Trust:** Users must trust a single corporate entity to hold funds and disburse them fairly.
* **Lack of Transparency:** Donors often lose track of where their money goes. Records can theoretically be altered internally.
* **High Fees:** Third-party middlemen charge exorbitant platform fees (often 5% to 10%) on top of payment processing fees.
* **Manual Enforcement:** Enforcing "All-or-Nothing" campaigns requires manual database audits and lengthy refund processing times.

## 3. Proposed Solution

ChainFund addresses these flaws by introducing blockchain methodologies:
* **Simulated Immutable Ledger:** Every donation is recorded as a block. Each block carries a cryptographic SHA-256 hash that includes the previous block's hash, creating an unbreakable chain of transparency.
* **Automated Smart Contracts:** Business logic runs autonomously. As soon as a campaign hits its target, funds are instantly marked for release. If a campaign expires without hitting its goal, the system automatically triggers refund status.
* **Direct Verification:** Donors have access to a public Ledger Explorer, allowing them to trace their exact transaction ID and the cryptographic block securing it.

## 4. System Architecture

The system operates on a modern 3-tier architecture:
1. **Presentation Layer (Frontend):** Built with React.js, Vite, and Tailwind CSS. It communicates securely via Axios interceptors. It provides interfaces for Creators (dashboards, campaign creation) and Donors (browsing, donating, exploring the ledger).
2. **Business Logic Layer (Backend):** Built with Node.js and Express.js. It handles authentication, validates data, and runs the `blockchainSim.js` module. It features a background interval worker that continuously checks smart contract conditions.
3. **Data Access Layer (Database):** Hosted on MongoDB. Stores user schemas, campaign metadata, and the critical `Block` collection that houses the cryptographic chain.

## 5. Technology Justification

* **React.js (Frontend):** chosen for its component-based architecture which allows high reusability (e.g., Campaign Cards, Progress Bars). The Virtual DOM ensures highly performant UI updates when donation numbers change.
* **Node.js (Backend):** JavaScript's asynchronous, non-blocking I/O model is perfect for handling simultaneous transactions and calculating cryptographic hashes on the fly without halting the API.
* **MongoDB (Database):** A NoSQL document database easily accommodates the unstructured and deeply nested data of a blockchain ledger (where blocks contain arrays of nested transaction references).

## 6. Blockchain Simulation Explained

### What is a Blockchain?
At its core, a blockchain is a distributed digital ledger consisting of records called blocks. These blocks are securely linked together using cryptographic hashes.

### How Our Simulation Works
Our system utilizes the `crypto` library to mirror true blockchain mechanics:
* **Hash Chaining:** When a donation occurs, it's compiled into a block alongside a timestamp and a random Nonce. The backend generates a SHA-256 hash of this data *combined* with the hash of the preceding block. 
* **Immutability Concept:** Because every block depends on the previous block's hash, altering any historical donation in the database would mathematically invalidate the entire chain moving forward.
* **The Explorer:** The frontend visualizes this chain just like Etherscan, granting total transparency.

### What is Not Simulated?
For MVP scope, we bypassed the complexities of full decentralized consensus (Proof of Work/Proof of Stake). We do not use a virtual machine (like EVM) or native cryptocurrencies (like ETH), nor do we incur gas fees. The simulation focuses strictly on the transparent ledger and automated smart contract logic.

## 7. Smart Contract Logic

The core logic acting as our "Smart Contract" runs both on-trigger (during a donation) and periodically (every 60 seconds). 

```javascript
// Pseudo-code for Smart Contract Settlement
function checkAndSettleCampaign(campaignId) {
    campaign = Database.getCampaign(campaignId);
    
    if (campaign.status != 'active') return;

    // Condition 1: Funding Goal Reached
    if (campaign.raisedAmount >= campaign.goalAmount) {
        campaign.status = 'funded';
        Log("Funds instantly released to creator");
    } 
    // Condition 2: Deadline Passed & Goal Missed
    else if (currentDate > campaign.deadline) {
        campaign.status = 'failed';
        Log("Refunds triggered for all donors");
    }
}
```

## 8. Database Design

* **Users:** `{ _id, name, email, password (hashed), role ('creator' or 'donor') }`
* **Campaigns:** `{ _id, title, description, goalAmount, raisedAmount, deadline, creator (ref), status }`
* **Donations:** `{ _id, campaign (ref), donor (ref), amount, transactionId, blockHash, blockNumber }`
* **Blocks:** `{ _id, blockNumber, hash, previousHash, timestamp, transactions [refs], nonce }`

## 9. User Roles & Flows

* **Creator Flow:** 
  1. Signs up selecting the "Creator" role.
  2. Accesses the secured Dashboard to create a new campaign.
  3. Sets a goal and deadline.
  4. Monitors the dashboard. Upon 100% funding, the smart contract updates the UI to "Funds Released".
* **Donor Flow:**
  1. Signs up selecting the "Donor" role.
  2. Browses the global feed of active campaigns.
  3. Clicks "Back this Project" to submit simulated funds.
  4. Immediately receives a unique Transaction ID and views the cryptographic block securing their donation on the public Explorer.

## 10. Security Measures

* **Authentication:** JSON Web Tokens (JWT) are used for stateless, secure session management.
* **Data Privacy:** User passwords are salted and hashed using `bcryptjs` before entering the database.
* **Role-Based Access Control (RBAC):** Custom Express middlewares (`roleCheck.js`) ensure that Donors cannot create campaigns and Creators cannot donate to their own campaigns (preventing artificial inflation).
* **Input Validation:** `express-validator` strictly enforces data types and prevents injection attacks on the API level.

## 11. Future Scope

While the current MVP successfully demonstrates the workflow, the next phase of development will bridge this simulation to a true Web3 ecosystem:
1. **Solidity Integration:** Rewriting the Node.js smart contract into Solidity and deploying it to the Ethereum Sepolia Testnet.
2. **Web3 Wallets:** Integrating MetaMask or WalletConnect, replacing email/password auth with wallet signatures.
3. **Decentralized Storage:** Migrating campaign images and descriptions to IPFS (InterPlanetary File System) to ensure zero central points of failure.

## 12. Conclusion

ChainFund successfully demonstrates how blockchain paradigms can eradicate the inefficiencies of traditional crowdfunding. By linking a modern, responsive React frontend with a cryptographically secure Node.js ledger, this project proves that transparency, immutability, and automated trust (smart contracts) can be achieved efficiently. It stands as a robust MVP and a stepping stone toward a fully decentralized Web3 application.

## 13. References

1. Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*. https://bitcoin.org/bitcoin.pdf
2. Wood, G. (2014). *Ethereum: A Secure Decentralised Generalised Transaction Ledger*. https://ethereum.github.io/yellowpaper/paper.pdf
3. Node.js Crypto Documentation. https://nodejs.org/api/crypto.html
4. React.js Official Documentation. https://reactjs.org/docs/getting-started.html
