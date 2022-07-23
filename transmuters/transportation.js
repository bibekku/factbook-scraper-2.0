const { toSnakeCase, removeCommasBetweenNumerals, splitNoParenComma } = require("../formatter");
const { findFieldById, transmuteHtmlToPlain, getNoteIfExists, extractFieldAndTransmute, findSubfieldByName } = require("../transmuter");

const ID = 'transportation';

function transportation(category) {
    return {
        'air_transport': {
            'national_system': national_air_transport_system(category),
            'civil_aircraft_registration_country_code_prefix': civil_aircraft_registration_country_code_prefix(category),
            'airports': {
                'total': extractFieldAndTransmute(category, 379, 'airports'),
                'paved': paved_airports(category),
                'unpaved': unpaved_airports(category),
            },
            'heliports': extractFieldAndTransmute(category, 382, 'total'),
        },
        'pipelines': pipelines(category),
        'railways': railways(category),
        'roadways': roadways(category),
        'waterways': waterways(category),
        'merchant_marine': merchant_marine(category),
        'ports_and_terminals': ports_and_terminals(category),
        'note': transportation_note(category),
    };
}


function national_air_transport_system(category) {
    const field = findFieldById(category, 377);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = parseFloat(subfield.value);
                    
                return [k, v];
             })
    );

    return {
        ...sections,
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}

function civil_aircraft_registration_country_code_prefix(category) {
    const field = findFieldById(category, 378);

    if (!field) return null;

    return {
        'prefix': field.value
    };
}


function paved_airports(category) {
    const field = findFieldById(category, 380);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name.replace(/m$/, 'metres'));
                const v = parseFloat(subfield.value);
                    
                return [k, v];
             })
    );

    return {
        ...sections,
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


function unpaved_airports(category) {
    const field = findFieldById(category, 381);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name.replace(/m$/, 'metres'));
                const v = parseFloat(subfield.value);
                    
                return [k, v];
             })
    );

    return {
        ...sections,
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


function pipelines(category) {
    const field = findFieldById(category, 383);

    if (!field) return null;
    if (!field.value) return transmuteHtmlToPlain(field.content);

    const cleanedString = removeCommasBetweenNumerals(transmuteHtmlToPlain(field.value));

    const regex = /^(?<length>[\d\.]+)\s*(km)?\s*(?<type>[^\(\)]+)( \((?<note>.+)\))?$/;

    return {
        'by_type': splitNoParenComma(cleanedString)
                        .map(line => line.trim())
                        .filter(Boolean)
                        .map(line => {
                            const match = regex.exec(line);
                            return {
                                'type': match.groups?.type,
                                'length': parseFloat(match.groups?.length),
                                'units': 'km',
                                'note': match.groups?.note
                            }
                        }),
        'date': field.info_date,
        ...getNoteIfExists(field)           
    };
}


function railways(category) {
    const field = findFieldById(category, 384);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = {
                    'length': parseFloat(subfield.value),
                    'units': subfield.suffix,
                    'note': subfield.subfield_note
                };
                return [k, v];
             })
    );

    return {
        ...sections,
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


function roadways(category) {
    const field = findFieldById(category, 385);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = {
                    'value': parseFloat(subfield.value),
                    'units': subfield.suffix
                };
                return [k, v];
             })
    );

    return {
        ...sections,
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


function waterways(category) {
    const field = findFieldById(category, 386);

    if (!field) return null;
    if (!field.value) return transmuteHtmlToPlain(field.content);

    return {
        'value': parseFloat(field.value),
        'units': field.suffix,
        'estimated': field.estimated,
        'date': field.info_date,
        'note': field.note || field.subfield_note
    };
}


function merchant_marine(category) {
    const field = findFieldById(category, 387);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    const sfTotal = findSubfieldByName(field, 'total');
    const sfByType = findSubfieldByName(field, 'by type');

    return {
        ...sfTotal && {
            'total': parseFloat(sfTotal.value),
        },
        ...sfByType && {
            'by_type': merchantShipsByType(sfByType.value)
        },
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date
    };
}


function merchantShipsByType(string) {
    const cleanedString = removeCommasBetweenNumerals(string);

    const shipTypes = ['bulk carrier', 'container ship', 'general cargo', 'oil tanker', 'other'];

    return shipTypes.map(type => {
        const regex = new RegExp(`${type} (?<count>\\d+)`);
        const match = regex.exec(cleanedString);

        return {
            'type': type,
            'count': match && parseFloat(match.groups?.count)
        }
    });
}


function ports_and_terminals(category) {
    const field = findFieldById(category, 388);

    const sfMajorSeaports = findSubfieldByName(field, 'major seaport(s)');
    const sfOilTerminals = findSubfieldByName(field, 'oil terminal(s)');
    const sfContainerPorts = findSubfieldByName(field, 'container port(s) (TEUs)');
    const sfRiverPorts = findSubfieldByName(field, 'river port(s)');
    const sfLakePorts = findSubfieldByName(field, 'lake port(s)');
    const sfLngImports = findSubfieldByName(field, 'LNG terminal(s) (import)');
    const sfLngExports = findSubfieldByName(field, 'LNG terminal(s) (export)');
    const sfDryBulkCargoPorts = findSubfieldByName(field, 'dry bulk cargo port(s)');

    const splitRegex = /[,;] /;

    return {
        ...sfMajorSeaports && {
            'major_seaports': transmuteHtmlToPlain(sfMajorSeaports.value)
                                .replaceAll('\n', ', ')
                                .split(splitRegex)
                                .filter(Boolean),
            'note': sfMajorSeaports.subfield_note
        },
        ...sfOilTerminals && {
            'oil_terminals': transmuteHtmlToPlain(sfOilTerminals.value)
                                .replaceAll('\n', ', ')
                                .split(splitRegex)
                                .filter(Boolean),
            'note': sfOilTerminals.subfield_note
        },
        ...sfContainerPorts && {
            'container_ports': transmuteContainerPorts(transmuteHtmlToPlain(sfContainerPorts.value)),
            'note': sfContainerPorts.subfield_note
        },
        ...sfRiverPorts && {
            'river_ports': transmuteHtmlToPlain(sfRiverPorts.value)
                                .replaceAll('\n', ', ')
                                .split(splitRegex)
                                .filter(Boolean),
            'note': sfRiverPorts.subfield_note
        },
        ...sfLakePorts && {
            'lake_ports': transmuteHtmlToPlain(sfLakePorts.value)
                                .replaceAll('\n', ', ')
                                .split(splitRegex)
                                .filter(Boolean),
            'note': sfLakePorts.subfield_note
        },
        ...sfLngImports && {
            'liquid_natural_gas_terminals_import': transmuteHtmlToPlain(sfLngImports.value)
                                                        .replaceAll('\n', ', ')
                                                        .split(splitRegex)
                                                        .filter(Boolean),
            'note': sfLngImports.subfield_note
        },
        ...sfLngExports && {
            'liquid_natural_gas_terminals_import': transmuteHtmlToPlain(sfLngExports.value)
                                                        .replaceAll('\n', ', ')
                                                        .split(splitRegex)
                                                        .filter(Boolean),
            'note': sfLngExports.subfield_note
        },
        ...sfDryBulkCargoPorts && {
            'dry_bulk_cargo_ports': transmuteDryBulkCargoPorts(transmuteHtmlToPlain(sfDryBulkCargoPorts.value)),
            'note': sfDryBulkCargoPorts.subfield_note
        }, 
        ...getNoteIfExists(field)
    }
}


function transmuteContainerPorts(string) {
    const cleanedString = removeCommasBetweenNumerals(string);

    const lines = cleanedString.split(/[,;] /);
    const regex = /^(?<place>.+) \((?<teu>\d+)\)$/;

    return lines.map(line => line.trim())
                .filter(Boolean)
                .map(line => {
                    const match = regex.exec(line);

                    if (!match) return line;

                    return {
                        'place': match && match.groups?.place,
                        'twenty_foot_equivalent_units': match && parseFloat(match.groups?.teu)
                    };
                })
}


function transmuteDryBulkCargoPorts(string) {
    const lines = string.split(/[,;] /);
    const regex = /^(?<place>.+) \((?<type>.+)\)$/;

    return lines.map(line => line.trim())
                .filter(Boolean)
                .map(line => {
                    const match = regex.exec(line);

                    if (!match) return line;

                    return {
                        'place': match && match.groups?.place,
                        'type': match && match.groups?.type
                    };
                })
}


function transportation_note(category) {
    const field = findFieldById(category, 389);

    if (!field) return undefined;
    return transmuteHtmlToPlain(field.content);
}


module.exports.transportation = transportation;