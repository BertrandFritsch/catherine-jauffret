function ConvertTo-SlugUri {
  [cmdletbinding()]
  param(
    [Parameter(Mandatory = $True)]
    [ValidateNotNullOrEmpty()]
    [string] $Name
  )

  # Credits goes to https://prograide.com/pregunta/39070/url-slugify-algorithme-en-c-
  # First to lower case 
  $value = $Name.ToLowerInvariant(); 
  
  # Remove all accents
  $bytes = [Text.Encoding]::GetEncoding("Cyrillic").GetBytes($value)
  $value = [Text.Encoding]::ASCII.GetString($bytes)
  
  # Replace spaces
  $value = [Text.RegularExpressions.Regex]::Replace($value, "\s", "-", [Text.RegularExpressions.RegexOptions]::Compiled)
  
  # Remove invalid chars
  $value = [Text.RegularExpressions.Regex]::Replace($value, "[^a-z0-9\s-_]", "", [Text.RegularExpressions.RegexOptions]::Compiled)
  
  # Trim dashes from end
  $value = $value.Trim('-', '_')
  
  # Replace double occurences of - or _
  $value = [Text.RegularExpressions.Regex]::Replace($value, "([-_]){2,}", "$1", [Text.RegularExpressions.RegexOptions]::Compiled)

  $value
}
