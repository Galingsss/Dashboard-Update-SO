import Papa from 'papaparse';

export interface PickingData {
  tanggal: string;
  kategori: string;
  kriteria: string;
  dk_lk: string;
  allocated: number;
  pickingConfirmed: number;
  printed: number;
  waiting: number;
  grandTotal: number;
}

const SHEET_BASE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQBXRWChVYJrpHj5yMIaObIxV4L8_dKS5oL3p-08FCuiclcfBtoHepKcvyNbCdMO9esSJnzShPPbtui/pub?output=csv';

export async function fetchPickingData(): Promise<PickingData[]> {
  try {
    // Add cache buster to bypass browser cache
    const cacheBuster = `&t=${new Date().getTime()}`;
    const response = await fetch(SHEET_BASE_URL + cacheBuster);
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const actualCsv = lines.slice(1).join('\n');

    return new Promise((resolve, reject) => {
      Papa.parse(actualCsv, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          const rawData = results.data as any[];
          const cleanedData: PickingData[] = [];
          
          let lastTanggal = '';
          let lastKategori = '';
          let lastKriteria = '';
          
          rawData.forEach((row) => {
            const rawTanggal = (row['Tanggal'] || '').trim();
            const rawKategori = (row['Kategori'] || '').trim();
            const rawKriteria = (row['Kriteria'] || '').trim();
            const dk_lk = (row['DK/LK'] || '').trim();
            
            // Update last known values for merged-cell simulation
            if (rawTanggal) lastTanggal = rawTanggal;
            if (rawKategori) lastKategori = rawKategori;
            
            // Update lastKriteria only if it's not a "Total" row
            if (rawKriteria) {
              if (rawKriteria.toLowerCase().includes('total')) {
                return; // Skip subtotal rows
              }
              lastKriteria = rawKriteria;
            }

            // Skip total/summary rows for Tanggal or Kategori
            if (lastTanggal.toLowerCase().includes('total') || lastKategori.toLowerCase().includes('total')) {
              return;
            }

            // A row is valid if it has DK/LK value and we have tracked the parent info
            if (!dk_lk || !lastKriteria) {
              return;
            }
            
            // Helper to find column value by loose header name with trim support
            const getVal = (row: any, search: string) => {
              const key = Object.keys(row).find(k => k.toLowerCase().replace(/\s/g, '').includes(search.toLowerCase().replace(/\s/g, '')));
              return key ? parseInt(row[key]) || 0 : 0;
            };

            cleanedData.push({
              tanggal: lastTanggal,
              kategori: lastKategori,
              kriteria: lastKriteria,
              dk_lk,
              allocated: getVal(row, 'Allocated'),
              pickingConfirmed: getVal(row, 'PickingConfirmed') || getVal(row, 'Picking') || 0,
              printed: getVal(row, 'Printed'),
              waiting: getVal(row, 'Waiting'),
              grandTotal: getVal(row, 'GrandTotal') || getVal(row, 'Total') || 0,
            });
          });

          resolve(cleanedData);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching picking data:', error);
    throw error;
  }
}
