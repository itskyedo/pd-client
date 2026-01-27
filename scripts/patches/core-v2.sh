#!/bin/sh

set -eu

file="$1"

apply_sed() {
  tmp="${file}.tmp"
  sed "$1" "$file" >"$tmp"
  mv "$tmp" "$file"
}

# Fix flattened Conflict schema references
#
# Normally, reusable schemas should be defined in `$/components/schemas` and
# referenced there. However, the PagerDuty OpenAPI spec makes response errors
# reference the `responses.Conflict` schema. With how `openapi-typescript`
# flattens schemas, this causes the reference to be lost during type generation.
patch_conflict_schema_refs() {
  capture_group='components\["responses"\]\["Conflict"\]\["content"\]\["application\/json"\]'
  apply_sed "s/\(${capture_group}\)\[\"schema\"\]/\1[\"error\"]/g"
}

# Fix flattened Tag schema references
#
# `openapi-typescript` flattens `allOf` into a single union. This causes
# references to those schemas to incorrectly reference a type that is no longer
# accessible via an index.
#
# Since Tag resolves to a single union, we can apply fixes for its references
# but other types will have to be manually typed.
patch_tag_schema_refs() {
  capture_group='components\["schemas"\]\["Tag"\]'
  apply_sed 's/\('"${capture_group}"'\)\["allOf"\]\["0"\]/\1/g'
}

# Remove never record intersections
#
# Types intersecting with `Record<string, never>` are unnecessary.
patch_never_record_intersections() {
  apply_sed 's/ & Record<string, never>//g'
}

# Fix Reference.type intersections
#
# Types that intersect with the Reference schema are resolving to `never` due to
# conflicting literal types with the `type` property.
patch_reference_type_intersections() {
  capture_group='components\["schemas"\]\["Reference"\]'
  apply_sed "s/\(${capture_group}\) \&/Omit<\1, 'type'> \&/g"
}

# Fix Tag.type intersections
#
# Types that intersect with the Tag schema are resolving to `never` due to
# conflicting literal types with the `type` property.
patch_tag_type_intersections() {
  capture_group='components\["schemas"\]\["Tag"\]'
  apply_sed "s/\(${capture_group}\) \&/Omit<\1, 'type'> \&/g"
}

patch_conflict_schema_refs
patch_tag_schema_refs
patch_never_record_intersections
patch_reference_type_intersections
patch_tag_type_intersections
