# Database Architecture

This document serves as the permanent ground-truth reference for the NBA Accreditation platform's database interactions.

## Hybrid Architecture Approach

Our application utilizes a **Hybrid Architecture** pattern within Supabase/PostgreSQL to balance standard relational data management with flexible, schema-less data structures for dynamic requirements.

### Relational Tables (UI State & Evidence)
We use strictly typed relational tables to handle predictable UI states and file tracking:
1. **`accreditation_nodes`**: The master junction table mapping a unique composite key `(framework, academic_year, quarter, node_id)` using `UNIQUE NULLS NOT DISTINCT`. This table serves as the primary foreign-key anchor (`id`) for all child records.
   - For annual frameworks (NBA, NAAC), `quarter` is stored as `NULL`.
   - For quarterly audit frameworks (IQAC), `quarter` stores `'Q1'`, `'Q2'`, `'Q3'`, or `'Q4'`.
   - It stores universally applicable state like `status` ('pending', 'ongoing', 'completed') and rich-text/HTML `introductory_notes`.
2. **`evidence_links`**: Stores explicit standard link references (e.g., Google Drive folders) tied to a `node_uuid`.
3. **`evidence_files`**: Tracks PDF and document uploads directly tied to a `node_uuid`, storing the resulting Supabase storage bucket references (`public_url`, `storage_path`).

### JSONB Document Table (Dynamic Spreadsheets)
Because the SAR contains dozens of unique tables (e.g., Table 5A: Faculty details vs. Table 3.8.1: Attainment of POs/PSOs) which could evolve or require different column shapes, we rely on a JSONB column to avoid infinite database migrations.
- **`dynamic_spreadsheets`**: Stores the raw array data from `react-datasheet-grid`. 
- Each table is saved as a single JSON array payload inside `grid_payload`, identifiable uniquely by the `(node_uuid, table_identifier)` composite key.

This structure allows us to iterate rapidly on frontend spreadsheet UIs while maintaining strict referential integrity for the core document hierarchy.
