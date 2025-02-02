# Definir la ruta de la carpeta a mapear
$ruta = "D:\personal\repositories\astral-cinema-app"

# Definir carpetas y archivos a excluir
$excludeFolders = @(".nuxt", ".output", ".vscode", ".yarn", "node_modules", ".terraform")
$excludeFiles = @(".terraform.lock.hcl", ".yarnrc.yml")


# Caracteres ASCII para el árbol
$verticalLine = "|   "
$branch = "+---"
$lastBranch = "\---"

# Función para mostrar la estructura de directorios en formato tree
function Show-Tree {
    param (
        [string]$Path,
        [string]$Indent = "",
        [bool]$IsLast = $true
    )

    # Obtener elementos en la carpeta actual
    $items = Get-ChildItem -Path $Path

    # Filtrar elementos excluidos
    $filteredItems = $items | Where-Object {
        $excludeFolders -notcontains $_.Name -and $excludeFiles -notcontains $_.Name
    }

    # Recorrer los elementos filtrados
    for ($i = 0; $i -lt $filteredItems.Count; $i++) {
        $item = $filteredItems[$i]
        $isLastItem = ($i -eq $filteredItems.Count - 1)

        # Mostrar el nombre de la carpeta o archivo
        if ($item.PSIsContainer) {
            Write-Output "$Indent$(if ($isLastItem) { $lastBranch } else { $branch }) $($item.Name)"
            # Llamada recursiva para subcarpetas
            Show-Tree -Path $item.FullName -Indent "$Indent$(if ($isLastItem) { '    ' } else { $verticalLine })" -IsLast $isLastItem
        } else {
            Write-Output "$Indent$(if ($isLastItem) { $lastBranch } else { $branch }) $($item.Name)"
        }
    }
}

# Llamar a la función para mostrar el árbol
Show-Tree -Path $ruta



# Reemplazar caracteres especiales
# $verticalLine = "|   "
# $branch = "+---"
# $lastBranch = "\---"

# Dentro de la función Show-Tree, reemplaza:
# '└───' con $lastBranch
# '├───' con $branch
# '│   ' con $verticalLine