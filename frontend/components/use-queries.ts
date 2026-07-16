import { generateCombinations, getModels, getOutfits, tryOnCombo, uploadModel, uploadOutfit, } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


// ── Queries ──
export function useOutfits() {
    return useQuery({
        queryKey: ["outfits"],
        queryFn: getOutfits,
        staleTime: 30_000,
    })

}

export function useModel() {
    return useQuery({
        queryKey: ["models"],
        queryFn: getModels,
        staleTime: 30_00
    })


}

// export function useFavorites(page = 1, limit = 1) {
//     const {get}
//     return useQuery({
//         queryKey: ["favorites", page, limit],
//         queryFn:g
//     })
// }


// ── Mutations ──

export function useUploadOutfits() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (formData: FormData) => uploadOutfit(formData),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outfits"] })
    })
}


export function useUploadModel() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (formdata: FormData) => uploadModel(formdata),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["models"] })
    })
}


export function useGenerateCombo() {

    return useMutation({
        mutationFn: ({ outfitIds, modelId }: { outfitIds: string[]; modelId?: string; }) => generateCombinations(outfitIds, modelId)
    });
}


export function useTryOn() {
    return useMutation({
        mutationFn: ({ modelStoragePath, outfitIds }: { modelStoragePath: string, outfitIds: string[] }) => tryOnCombo(modelStoragePath, outfitIds)
    })
}