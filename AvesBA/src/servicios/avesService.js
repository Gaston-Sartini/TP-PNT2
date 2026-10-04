
async function obtenerAves() {    
        const response = await fetch('https://api.inaturalist.org/v1/observations/species_counts?taxon_id=3&place_id=10434&native=true&quality_grade=research&locale=es-AR&per_page=100');
        if (!response.ok) {
            throw new Error('Error ' + response.status + ': ' + response.statusText + ' . No se pudieron obtener las aves');
        }
        const aves = await response.json();
        const avesTransformadas = aves.results
            .filter(ave => ave.taxon.default_photo && ave.taxon.preferred_common_name)
            .map(ave => ({
                id: ave.taxon.id,
                nombre: ave.taxon.preferred_common_name,
                nombreCientifico: ave.taxon.name,
                foto: ave.taxon.default_photo.medium_url,
                atribucion: ave.taxon.default_photo.attribution
            }));
        return avesTransformadas;    
}

export { obtenerAves };