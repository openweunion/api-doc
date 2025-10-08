# User Flow Overview

Illustrates the end-to-end transaction process between the **Originator** and the **Beneficiary**, highlighting the interactions and state transitions.

### Sequence Diagram

[![Transaction Statuses](./images/sequence_diagram.jpg)](./images/sequence_diagram.jpg)

# Transaction Overview

Outlines the lifecycle of a transaction between the **Originator VASP** and the **Beneficiary VASP**.

### Transaction Lifecycle Diagram

[![Transaction Statuses](./images/transaction_status.jpg)](./images/transaction_status.jpg)

### Flow Breakdown

1. **Create Transaction**
   - Status: `NEW`
   - Initiated by **Originator VASP**

2. **Approve Transaction**
   - Status: `APPROVED`
   - Confirmed by **Originator VASP**

3. **Cancel Transaction**
   - Status: `CANCELLED`
   - Cancelled by **Originator VASP**

4. **Accept Transaction**
   - Status: `ACCEPTED`
   - Accepted by **Beneficiary VASP**

5. **Reject Transaction**
   - Status: `REJECTED`
   - Rejected by **Beneficiary VASP**

6. **Transfer Transaction**
   - Status: `PENDING TRANSFER`
   - On-chain transfer initiated by **Originator VASP**

7. **Update Transaction Hash**
   - Status: `TRANSFERRED`
   - Transaction hash submitted by **Originator VASP**

8. **Complete Transaction**
   - Status: `COMPLETED`
   - Finalized by **Beneficiary VASP**
