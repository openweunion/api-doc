# User Flow Overview

Illustrates the end-to-end transaction process between the **Originator** and the **Beneficiary**, highlighting the interactions and state transitions.

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber

    actor M as Maria (SEND UAE)
    participant T as UAE VASP
    participant O as WeUnion
    participant L as HK VASP
    actor P as Peter (RECV HK)
    participant S as Simple Bank

    rect rgb(200, 230, 255, 0.4)
    Note over T: Onboard
    T->>O: Register with VASP's details (name, description, email, webhook URL)
    O-->>T: Return apiKey, secret, vaspId
    end

    rect rgb(200, 230, 255, 0.4)
    Note over L: Onboard
    L->>O: Register with VASP's details (name, description, email, webhook URL, quote URL, deposit address)
    O-->>L: Return apiKey, secret, vaspId
    end

    rect rgb(200, 230, 255, 0.4)
    Note over P: Onboard
    P->>S: Open account
    S-->>P: Return account details
    end

    rect rgb(200, 230, 255, 0.3)
    Note over P: Onboard
    P->>L: Register with user info
    L-->>P: Return user details
    end

    rect rgb(200, 230, 255, 0.3)
    Note over M: Onboard
    M->>T: Register with user info
    T-->>M: Return user details
    end

    rect rgb(255, 200, 150, 0.3)
    Note over M: New Transaction
    M->>T: Input remittance details
    T->>O: [API] Get offRamp quotes
    O->>L: [API] Get offRamp quote
    L-->>O: Return quote
    O-->>T: Return quotes
    T-->>M: Display quotes
    M->>M: Select quote
    M->>T: Confirm remittance details
    T->>O: [API] Create offRamp transaction
    O-->>T: Return transaction details
    O->>L: [Webhook] Notify offRamp transaction created
    end

    rect rgb(200, 255, 200, 0.3)
    Note over M: Information Flow
    alt Originator VASP cancel
    T->>O: [API] Cancel offRamp transaction
    O-->>T: Return transaction CANCELLED
    T->>M: Display transaction CANCELLED
    O->>L: [Webhook] Notify offRamp transaction CANCELLED
    else Originator VASP approve
    T->>O: [API] Approve offRamp transaction
    O-->>T: Return transaction APPROVED
    T->>M: Display transaction APPROVED
    O->>L: [Webhook] Notify offRamp transaction APPROVED
    end

    alt Beneficiary VASP reject
    L->>O: [API] Reject offRamp transaction
    O-->>L: Return transaction REJECTED
    O->>T: [Webhook] Notify offRamp transaction REJECTED
    T->>M: Display transaction REJECTED
    else Beneficiary VASP accept
    L->>O: [API] Accept offRamp transaction
    O-->>L: Return transaction ACCEPTED
    O->>T: [Webhook] Notify offRamp transaction ACCEPTED
    end
    end

    rect rgb(180, 200, 255, 0.3)
    Note over M: Cash Flow
    par Transfer USDC
    T->>L: [RPC] Transfer USDC to HK VASP deposit address (On behalf of Maria)
    and Update Transaction status
    T->>O: [API] Transfer offRamp transaction
    O-->>T: Return transaction PENDING_TRANSFER
    O->>L: [Webhook] Notify offRamp transaction PENDING_TRANSFER
    end
    T->>T: Wait for on-chain confirmation
    T->>O: [API] Update transaction hash of offRamp transaction
    O-->>T: Return transaction TRANSFERRED
    O->>L: [Webhook] Notify offRamp transaction TRANSFERRED
    end

    rect rgb(220, 180, 240, 0.3)
    Note over M: Withdraw
    L->>L: Convert USDC to HKD
    L->>S: Transfer HKD to Peter's fiat account
    S-->>L: Return bank referenceId

    L->>O: [API] Complete offRamp transaction with referenceId
    O-->>L: Return transaction COMPLETED
    O->>T: [Webhook] Notify offRamp transaction COMPLETED
    T->>M: Display transaction COMPLETED
    end
```

# Transaction Overview

Outlines the lifecycle of a transaction between the **Originator VASP** and the **Beneficiary VASP**.

### Transaction Lifecycle Diagram

```mermaid
flowchart LR
    subgraph Background[ ]
        subgraph Legend[ ]
            direction LR
            API[api endpoint]
            STATUS((STATUS))
        end
        
        subgraph Main[ ]
            direction LR
            START(( )) --> CREATE[create tx] --> NEW((NEW))
            NEW --> APPROVE[approve tx] --> APPROVED((APPROVED))
            NEW --> CANCEL[cancel tx] --> CANCELLED((CANCELLED))
            APPROVED --> ACCEPT[accept tx] --> ACCEPTED((ACCEPTED))
            APPROVED --> REJECT[reject tx] --> REJECTED((REJECTED))
            ACCEPTED --> TRANSFER[transfer tx] --> PENDING_TRANSFER((PENDING_TRANSFER))
            PENDING_TRANSFER --> UPDATE[update tx-hash] --> TRANSFERRED((TRANSFERRED))
            TRANSFERRED --> COMPLETE[complete tx] --> COMPLETED((COMPLETED))
        end
    end

    %% Styles
    style Background fill:#f5f5f5,stroke:#ccc
    style Main fill:transparent,stroke:transparent
    style Legend fill:#ffffff,stroke:#999,stroke-dasharray:5 5
    style API fill:#cce5ff,stroke:#333
    style STATUS fill:#ffffcc,stroke:#333
    style CREATE fill:#cce5ff,stroke:#333
    style APPROVE fill:#cce5ff,stroke:#333
    style CANCEL fill:#cce5ff,stroke:#333
    style ACCEPT fill:#cce5ff,stroke:#333
    style REJECT fill:#cce5ff,stroke:#333
    style TRANSFER fill:#cce5ff,stroke:#333
    style UPDATE fill:#cce5ff,stroke:#333
    style COMPLETE fill:#cce5ff,stroke:#333
    style NEW fill:#ffffcc,stroke:#333
    style APPROVED fill:#ffffcc,stroke:#333
    style ACCEPTED fill:#ffffcc,stroke:#333
    style PENDING_TRANSFER fill:#ffffcc,stroke:#333
    style TRANSFERRED fill:#ffffcc,stroke:#333
    style COMPLETED fill:#ccffcc,stroke:#333
    style CANCELLED fill:#ffcccc,stroke:#333
    style REJECTED fill:#ffcccc,stroke:#333
```

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
   - Status: `PENDING_TRANSFER`
   - On-chain transfer initiated by **Originator VASP**

7. **Update Transaction Hash**
   - Status: `TRANSFERRED`
   - Transaction hash submitted by **Originator VASP**

8. **Complete Transaction**
   - Status: `COMPLETED`
   - Finalized by **Beneficiary VASP**
